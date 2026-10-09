"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
//this is something crzy a part like yeah similar to the middleware of mongoose but token being stored in broswer 
const authenticateToken = (req, res, next) => {
    const token = req.cookies?.token;
    if (!token) {
        res.status(401).json({ message: "Access token missing" });
        return;
    }
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error("JWT_SECRET is not defined");
    }
    // Verify JWT from cookie and extract the authenticated user's ID
    try {
        const decoded = jsonwebtoken_1.default.verify(token, secret, { algorithms: ["HS256"] });
        if (typeof decoded === "string" || typeof decoded.userId !== "string") {
            res.status(401).json({ message: "Invalid token" });
            return;
        }
        // Attach verified userId to the current request for protected routes
        req.userId = decoded.userId;
        next();
    }
    catch {
        res.status(401).json({ message: "Invalid or expired token" });
    }
};
exports.default = authenticateToken;
//# sourceMappingURL=auth.js.map