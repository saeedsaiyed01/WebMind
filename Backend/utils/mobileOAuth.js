import crypto from "node:crypto";
import jwt from "jsonwebtoken";

export const mobileReturnUrl = "webmind:///";
export function digest(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}
export function createMobileState(secret) {
  const verifier = crypto.randomBytes(32).toString("hex");
  const challenge = digest(verifier);
  const signedState = jwt.sign({ challenge }, secret, {
    algorithm: "HS256",
    audience: "webmind-mobile-oauth",
    issuer: "webmind",
    expiresIn: "10m",
  });
  return { verifier, challenge, signedState };
}
export function verifyMobileState(state, secret) {
  if (typeof state !== "string") throw new Error("Missing OAuth state");
  const data = jwt.verify(state, secret, {
    algorithms: ["HS256"],
    audience: "webmind-mobile-oauth",
    issuer: "webmind",
  });
  if (
    typeof data.challenge !== "string" ||
    !/^[a-f0-9]{64}$/.test(data.challenge)
  )
    throw new Error("Invalid OAuth state");
  return data.challenge;
}
export function mobileCallback(challenge, parameters) {
  const url = new URL(mobileReturnUrl);
  url.searchParams.set("state", challenge);
  for (const [name, value] of Object.entries(parameters))
    url.searchParams.set(name, value);
  return url.toString();
}
