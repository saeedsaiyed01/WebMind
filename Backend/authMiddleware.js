import { jwtVerify } from "jose";
import { JWT_PASSWORD } from "./config.js";

export async function userMiddleware(req, res, next) {
  const header = req.headers["authorization"];
  console.log("Received Authorization header:", header);
  
  if (!header) {
    return res.status(403).json({ message: "Authorization header missing" });
  }

  // Since you're not using a Bearer scheme, we use the header value directly.
  const token = header;
  console.log("Extracted Token:", token);

  try {
    // jwtVerify returns a promise; use await and encode the secret with TextEncoder
    const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_PASSWORD));
    console.log("Decoded Token:", payload);

    if (!payload || typeof payload !== "object" || !payload.id) {
      return res.status(403).json({ message: "Invalid token format" });
    }

    req.userId = payload.id;
    next();
  } catch (error) {
    console.error("JWT Verification Error:", error.message);
    return res.status(403).json({ message: "Invalid or expired token" });
  }
}
