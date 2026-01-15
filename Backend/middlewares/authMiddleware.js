import { jwtVerify } from "jose";
import { JWT_PASSWORD } from "../config.js";

export async function userMiddleware(req, res, next) {
  const header = req.headers["authorization"];
  
  if (!header) {
    return res.status(403).json({ message: "Authorization header missing" });
  }

  // Support both "Bearer <token>" and raw token
  const token = header.startsWith("Bearer ") ? header.slice(7).trim() : header;

try {
    // jwtVerify returns a promise; use await and encode the secret with TextEncoder
    const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_PASSWORD));

    if (!payload || typeof payload !== "object" || !payload.id) {
      return res.status(403).json({ message: "Invalid token format" });
    }

    req.userId = payload.id;
next();
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("JWT Verification Error:", error.message);
    }
    return res.status(403).json({ message: "Invalid or expired token" });
  }
}
