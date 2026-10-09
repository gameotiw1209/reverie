"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginLimiter = exports.signupLimiter = void 0;
const express_rate_limit_1 = require("express-rate-limit");
exports.signupLimiter = (0, express_rate_limit_1.rateLimit)({
    windowMs: 60 * 60 * 1000,
    limit: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: { msg: "Too many signup attempts. Try again later." }
});
exports.loginLimiter = (0, express_rate_limit_1.rateLimit)({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { msg: "Too many login attempts. Try again later." }
});
//# sourceMappingURL=ratelimit.js.map