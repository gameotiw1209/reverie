"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatRateLimiter = void 0;
const express_rate_limit_1 = require("express-rate-limit");
exports.chatRateLimiter = (0, express_rate_limit_1.rateLimit)({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    keyGenerator: (req) => req.userId,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        msg: "Too many chat requests. Please try again later."
    }
});
//# sourceMappingURL=chatRateLimit.js.map