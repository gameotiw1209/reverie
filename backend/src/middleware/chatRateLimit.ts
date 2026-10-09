import { rateLimit } from "express-rate-limit";
import { Request } from "express";

export const chatRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  keyGenerator: (req: Request) => req.userId!,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    msg: "Too many chat requests. Please try again later."
  }
});