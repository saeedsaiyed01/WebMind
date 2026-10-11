import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import vm from "node:vm";
import express from "express";
import jwt from "jsonwebtoken";
import * as crypto from "node:crypto";
import {
  createMobileState,
  verifyMobileState,
  digest,
} from "../utils/mobileOAuth.js";

const secret = "isolated-test-secret-at-least-32-characters";

test("OAuth state binds the verifier, expires, and rejects tampering and account JWTs", () => {
  const state = createMobileState(secret);
  assert.equal(
    verifyMobileState(state.signedState, secret),
    digest(state.verifier),
  );
  assert.equal(state.challenge.length, 64);
  assert.throws(() => verifyMobileState(state.signedState, "wrong-secret"));
  assert.throws(() =>
    verifyMobileState(jwt.sign({ id: "user" }, secret), secret),
  );
  const expired = jwt.sign({ challenge: state.challenge }, secret, {
    audience: "webmind-mobile-oauth",
    issuer: "webmind",
    expiresIn: -1,
  });
  assert.throws(() => verifyMobileState(expired, secret));
});

async function harness(t, denied = false) {
  const handoffs = new Map();
  const model = {
    create: async (value) => {
      handoffs.set(value.codeHash, value);
    },
    findOneAndDelete: async (query) => {
      const value = handoffs.get(query.codeHash);
      if (
        !value ||
        value.challenge !== query.challenge ||
        value.expiresAt <= query.expiresAt.$gt
      )
        return null;
      handoffs.delete(query.codeHash);
      return value;
    },
  };
  const passport = {
    authenticate: (_name, options, callback) => (req, res) =>
      callback
        ? callback(null, denied ? false : { _id: "qa-user" })
        : res.json({ state: options.state || null }),
  };
  const context = vm.createContext({
    URL,
    Date,
    console,
    process: { env: { FRONTEND_URL: "https://webmind.space" } },
  });
  const values = {
    "node:crypto": { default: crypto },
    express: { default: express },
    jsonwebtoken: { default: jwt },
    passport: { default: passport },
    "../config.js": {
      JWT_PASSWORD: secret,
      GOOGLE_REDIRECT_URI:
        "https://api.example.test/api/v1/auth/google/callback",
    },
    "../models/oauthHandoff.model.js": { OAuthHandoff: model },
    "../middlewares/sanitization.js": {
      authLimiter: (_req, _res, next) => next(),
    },
  };
  const module = new vm.SourceTextModule(
    await readFile(new URL("../config/googleAuth.js", import.meta.url), "utf8"),
    { context },
  );
  await module.link(async (specifier) => {
    if (specifier === "../utils/mobileOAuth.js") {
      const helpers = await import("../utils/mobileOAuth.js");
      values[specifier] = helpers;
    }
    const exported = values[specifier];
    return new vm.SyntheticModule(
      Object.keys(exported),
      function () {
        for (const [key, value] of Object.entries(exported))
          this.setExport(key, value);
      },
      { context },
    );
  });
  await module.evaluate();
  const app = express();
  app.use(express.json());
  app.use("/api/v1/auth", module.namespace.default);
  const server = app.listen(0, "127.0.0.1");
  await new Promise((resolve) => server.on("listening", resolve));
  t.after(
    () =>
      new Promise((resolve) => {
        server.closeAllConnections();
        server.close(resolve);
      }),
  );
  const base = `http://127.0.0.1:${server.address().port}/api/v1/auth`;
  const post = (path, body = {}) =>
    fetch(base + path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  return { base, post, handoffs };
}

test("mobile OAuth returns to the app and exchanges a code exactly once", async (t) => {
  const h = await harness(t);
  const response = await h.post("/google/mobile-start");
  assert.equal(response.headers.get("cache-control"), "no-store");
  const start = await response.json();
  const authorization = new URL(start.authorizationUrl);
  assert.equal(authorization.origin, "https://api.example.test");
  assert.equal(authorization.searchParams.get("redirect_uri"), null);
  const callback = await fetch(
    h.base +
      "/google/callback?state=" +
      encodeURIComponent(authorization.searchParams.get("state")),
    { redirect: "manual" },
  );
  const result = new URL(callback.headers.get("location"));
  assert.equal(result.protocol, "webmind:");
  assert.equal(result.pathname, "/");
  assert.equal(result.searchParams.get("state"), start.state);
  assert.equal(result.searchParams.get("token"), null);
  const code = result.searchParams.get("code");
  assert.equal(
    (
      await h.post("/google/mobile-exchange", {
        code,
        verifier: "0".repeat(64),
      })
    ).status,
    401,
  );
  const exchange = await h.post("/google/mobile-exchange", {
    code,
    verifier: start.verifier,
  });
  assert.equal(exchange.status, 200);
  assert.equal(jwt.verify((await exchange.json()).token, secret).id, "qa-user");
  assert.equal(
    (
      await h.post("/google/mobile-exchange", {
        code,
        verifier: start.verifier,
      })
    ).status,
    401,
  );
});

test("expired handoffs, invalid state, and malformed exchanges are rejected", async (t) => {
  const h = await harness(t);
  const code = "c".repeat(64),
    verifier = "a".repeat(64);
  h.handoffs.set(digest(code), {
    challenge: digest(verifier),
    expiresAt: new Date(0),
  });
  assert.equal(
    (await h.post("/google/mobile-exchange", { code, verifier })).status,
    401,
  );
  assert.equal(
    (
      await fetch(h.base + "/google/callback?state=tampered", {
        redirect: "manual",
      })
    ).status,
    400,
  );
  assert.equal((await fetch(h.base + "/google?state=tampered")).status, 400);
  assert.equal(
    (await h.post("/google/mobile-exchange", { code: [] })).status,
    400,
  );
});

test("Google denial returns a recoverable error to the requesting app", async (t) => {
  const h = await harness(t, true);
  const start = createMobileState(secret);
  const response = await fetch(
    h.base + "/google/callback?state=" + encodeURIComponent(start.signedState),
    { redirect: "manual" },
  );
  const callback = new URL(response.headers.get("location"));
  assert.equal(callback.protocol, "webmind:");
  assert.equal(callback.searchParams.get("error"), "google_failed");
  assert.equal(callback.searchParams.get("state"), start.challenge);
});

test("the existing website Google callback still returns its session", async (t) => {
  const h = await harness(t);
  const response = await fetch(h.base + "/google/callback", {
    redirect: "manual",
  });
  const callback = new URL(response.headers.get("location"));
  assert.equal(callback.origin, "https://webmind.space");
  assert.equal(
    jwt.verify(callback.searchParams.get("token"), secret).id,
    "qa-user",
  );
});
