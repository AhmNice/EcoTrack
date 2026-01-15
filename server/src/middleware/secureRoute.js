import { rateLimiter } from "./rateLimiter.js";
import { verifySession } from "../util/session.js";

export const secureRoute = async (req, res, next) => {
  try {
    // Apply rate limiting
    await new Promise((resolve, reject) => {
      rateLimiter(req, res, (err) => (err ? reject(err) : resolve()));
    });

    // Verify JWT session
   await verifySession(req, res, next);

  } catch (error) {
    console.error("❌ SecureRoute error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
