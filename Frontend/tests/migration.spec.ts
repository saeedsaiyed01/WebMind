import { expect, test, type Page } from "@playwright/test";

const user = { id: "test-user", name: "Migration Tester", email: "migration@example.test", credits: 20 };

async function mockApi(page: Page) {
  const requests: string[] = [];
  let content: { _id: string; title: string; type: string; content: string }[] = [];
  await page.route("**/api/v1/**", async (route) => {
    const request = route.request();
    const pathname = new URL(request.url()).pathname;
    requests.push(`${request.method()} ${pathname}`);
    const json = (body: unknown) => route.fulfill({ json: body });
    if (pathname === "/api/v1/auth/me") return json(user);
    if (/\/auth\/(signin|signup)$/.test(pathname)) return json({ token: "fixture-token" });
    if (pathname === "/api/v1/plan") return json({ credits: 20, plan: "free" });
    if (pathname === "/api/v1/models") return json({ models: [{ id: "gemini-2.5-flash", name: "Gemini 2.5 Flash" }] });
    if (pathname === "/api/v1/conversations") return json([]);
    if (pathname === "/api/v1/content" || pathname === "/api/v1/content/search") return json({ content, results: content });
    if (pathname === "/api/v1/memory") {
      const body = request.postDataJSON();
      content = [{ _id: "saved-note", title: body.title, type: body.type, content: body.content }];
      return json({ success: true });
    }
    if (pathname === "/api/v1/saved-note" && request.method() === "PUT") {
      content = content.map((item) => ({ ...item, title: request.postDataJSON().newTitle }));
      return json({ success: true });
    }
    if (pathname === "/api/v1/saved-note" && request.method() === "DELETE") {
      content = [];
      return json({ success: true });
    }
    if (pathname === "/api/v1/chat") return route.fulfill({
      contentType: "application/x-ndjson",
      body: [
        { type: "phase", phase: "searching" },
        { type: "result", answer: "Your migration chat works.", conversationId: "fixture-chat", remainingCredits: 19 },
      ].map((event) => JSON.stringify(event)).join("\n"),
    });
    if (pathname === "/api/v1/conversation/fixture-chat") return json([{ message: "Check my migration", response: "Your migration chat works.", createdAt: "2026-01-01T00:00:00Z" }]);
    if (pathname === "/api/v1/create-session") return json({ checkout_url: "http://localhost:3101/payment-success?session_id=fixture" });
    throw new Error(`Unexpected API request: ${request.method()} ${pathname}`);
  });
  return requests;
}

async function savedSession(page: Page) {
  await page.addInitScript(() => localStorage.setItem("token", "fixture-token"));
}

test.beforeEach(async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error" && /hydration|Minified React error/i.test(message.text())) errors.push(message.text());
  });
  Object.assign(page, { migrationErrors: errors });
});

test.afterEach(async ({ page }) => {
  expect((page as Page & { migrationErrors: string[] }).migrationErrors).toEqual([]);
});

test("public pages render metadata and direct links without a SPA fallback", async ({ page, request }, testInfo) => {
  for (const [path, title] of [["/", "WebMind"], ["/pricing", "Pricing"], ["/signin", "Sign In"], ["/signup", "Sign Up"]]) {
    const response = await request.get(path);
    expect(response.status()).toBe(200);
    const html = await response.text();
    expect(html).toContain('<meta name="description"');
    expect(html).toContain('<meta property="og:title"');
    await page.goto(path);
    await expect(page).toHaveTitle(new RegExp(title));
    await expect(page.locator("h1").first()).toBeVisible();
    if (path === "/") {
      await expect(page.locator("h1")).toHaveCSS("opacity", "1");
      await page.screenshot({ path: testInfo.outputPath("landing.png") });
    }
  }
  const response = await page.goto("/missing-page");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: "Page not found" })).toBeVisible();
});

test("protected deep links redirect after hydration and login restores the destination", async ({ page }) => {
  await mockApi(page);
  await page.goto("/chat/fixture-chat");
  await expect(page).toHaveURL(/\/signin\?next=/);
  await page.getByLabel("Email", { exact: true }).fill(user.email);
  await page.getByLabel("Password", { exact: true }).fill("fixture-password");
  await page.getByRole("button", { name: "Sign In", exact: true }).click();
  await expect(page).toHaveURL(/\/chat\/fixture-chat$/);
  await expect(page.getByText("Your migration chat works.", { exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByText("Your migration chat works.", { exact: true })).toBeVisible();
});

test("signup initializes the session without a full reload", async ({ page }) => {
  const requests = await mockApi(page);
  await page.goto("/signup");
  await page.getByLabel("Email", { exact: true }).fill(user.email);
  await page.getByLabel("Password", { exact: true }).fill("fixture-password");
  await page.getByRole("button", { name: "Create Account", exact: true }).click();
  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.getByRole("button", { name: "Add Content", exact: true })).toBeVisible();
  await expect.poll(() => requests.includes("GET /api/v1/auth/me")).toBe(true);
});

test("Google OAuth handoff removes the token and restores the workspace", async ({ page }) => {
  await mockApi(page);
  await page.goto("/?token=fixture-oauth-token");
  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.getByRole("button", { name: "Add Content", exact: true })).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem("token"))).toBe("fixture-oauth-token");
  await page.reload();
  await expect(page.getByRole("button", { name: "Add Content", exact: true })).toBeVisible();
});

test("chat streams a response, updates the route, and supports direct refresh", async ({ page }) => {
  await mockApi(page);
  await savedSession(page);
  await page.goto("/chat");
  await page.getByRole("textbox").fill("Check my migration");
  await page.getByRole("button", { name: "Send message", exact: true }).click();
  await expect(page).toHaveURL(/\/chat\/fixture-chat$/);
  await expect(page.getByText("Your migration chat works.", { exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByText("Your migration chat works.", { exact: true })).toBeVisible();
});

test("content can be created, edited, and deleted through the configured API", async ({ page }, testInfo) => {
  const requests = await mockApi(page);
  await savedSession(page);
  await page.goto("/dashboard");
  await page.getByRole("button", { name: "Add Content", exact: true }).click();
  await page.getByRole("button", { name: "Note", exact: true }).click();
  await page.getByPlaceholder("Title", { exact: true }).fill("Migration note");
  await page.getByPlaceholder("Write your note...").fill("Saved through Next.js.");
  await page.getByRole("button", { name: "Submit Content", exact: true }).click();
  await expect(page.getByText("Migration note", { exact: true })).toBeVisible();
  expect(requests).toContain("POST /api/v1/memory");
  await page.getByTitle("Edit Title", { exact: true }).click();
  await page.getByPlaceholder("Content Title", { exact: true }).fill("Edited migration note");
  await page.getByPlaceholder("Content Title", { exact: true }).press("Enter");
  await expect(page.getByText("Edited migration note", { exact: true })).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath("dashboard.png"), fullPage: true });
  await page.getByTitle("Delete", { exact: true }).click();
  await page.getByRole("button", { name: "Delete Content", exact: true }).click();
  await expect(page.getByText("Edited migration note", { exact: true })).toHaveCount(0);
  expect(requests).toContain("PUT /api/v1/saved-note");
  expect(requests).toContain("DELETE /api/v1/saved-note");
});

test("expired sessions redirect and do not restore stale credentials", async ({ page }) => {
  await mockApi(page);
  await page.route("**/api/v1/auth/me", (route) => route.fulfill({ status: 401, json: { error: "Expired" } }));
  await page.goto("/signin");
  await page.evaluate(() => localStorage.setItem("token", "expired-fixture"));
  await page.goto("/dashboard");
  await expect(page).toHaveURL(/\/signin\?next=/);
  expect(await page.evaluate(() => localStorage.getItem("token"))).toBeNull();
  await page.goto("/chat");
  await expect(page).toHaveURL(/\/signin\?next=/);
});

test("saved light theme survives hydration and mobile pages fit the viewport", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("theme", "light"));
  await page.goto("/pricing");
  await expect(page.locator("html")).toHaveClass(/light/);
  await page.reload();
  await expect(page.locator("html")).toHaveClass(/light/);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test("billing checkout and cancellation preserve their return routes", async ({ page }) => {
  const requests = await mockApi(page);
  await savedSession(page);
  await page.goto("/pricing");
  await page.getByRole("button", { name: "Upgrade to Pro", exact: true }).click();
  await expect(page).toHaveURL(/\/payment-success\?session_id=fixture/);
  await expect(page.getByRole("heading", { name: "Payment Successful!" })).toBeVisible();
  expect(requests).toContain("POST /api/v1/create-session");
  await page.goto("/payment-cancel");
  await expect(page.getByRole("heading")).toBeVisible();
  expect(await page.locator('meta[name="robots"]').getAttribute("content")).toContain("noindex");
});
