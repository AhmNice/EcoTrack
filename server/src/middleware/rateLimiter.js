import rateLimit from "express-rate-limit";

export const rateLimiter = rateLimit({
  windowMs: process.env.RATE_LIMIT_WINDOW || 15 * 60 * 1000,
  max: process.env.RATE_LIMIT_MAX || 90,
  standardHeaders: true,
  legacyHeaders: false,

  // Custom handler when limit is exceeded
  handler: (req, res, next) => {
    console.warn(
      `⚠️ Rate limit exceeded for IP: ${req.ip}, URL: ${req.originalUrl}`
    );
    res.status(429).json({
      success: false,
      message:
        "Too many requests from this IP, please try again after 15 minutes",
    });
  },
});
