"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const auth_1 = __importDefault(require("../middleware/auth"));
const prisma_1 = require("../lib/prisma");
const ratelimit_1 = require("../middleware/ratelimit");
const authRouter = express_1.default.Router();
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//this is a signup post like its easy to get an idea of what is going on like i only messed up with the prisma.user.create earlier
//as it was some prisma generate error and like yeah the way i did first it with the mongoose only a prisma.user comes in extra and 
//also like bringing it with some structure way of making it in data property object that was it ig
authRouter.post('/auth/signup', ratelimit_1.signupLimiter, async (req, res) => {
    try {
        const { email, password, name } = req.body ?? {};
        if (typeof email !== "string" ||
            typeof password !== "string" ||
            typeof name !== "string") {
            res.status(400).json({ msg: 'all fields are required' });
            return;
        }
        const normalizedEmail = email.trim().toLowerCase();
        if (normalizedEmail.length > 254 || !EMAIL_REGEX.test(normalizedEmail)) {
            res.status(400).json({ msg: "invalid email form" });
            return;
        }
        if (password.length < 8 || password.length > 64) {
            res.status(400).json({ msg: "password must be greater then 8 characters" });
            return;
        }
        if (name.length > 50) {
            res.status(400).json({ msg: "name can't be this big sybau" });
            return;
        }
        const passwordHash = await bcrypt_1.default.hash(password, 12);
        const newUser = await prisma_1.prisma.user.create({
            data: {
                email: normalizedEmail,
                name: name,
                passwordHash
            },
            select: {
                id: true,
                email: true
            },
        });
        res.status(201).json({ msg: "user CREATED SUCCESSFULLY", newUser });
        return;
    }
    catch (error) {
        // duplicate EMAIL
        if (error instanceof client_1.Prisma.PrismaClientKnownRequestError &&
            error.code === "P2002") {
            res.status(409).json({ msg: "email already registered" });
            return;
        }
        console.error("Error creating user: ", error);
        res.status(500).json({ error: "Error creating user" });
        return;
    }
});
//loginstart was pretty easy after the signup as usal but the res.cookie method of express was something new like in thsi prj we be storing it in cookie like into 
// the browser earlier it was directly handed to the user so like with that token he needs to get to the website but this time its damn proffesional and easy like after
//this cookie gets into the broswer with authenticateToken in the middleware user can easily post there notes and get it 
authRouter.post('/auth/login', ratelimit_1.loginLimiter, async (req, res) => {
    try {
        const { email, password } = req.body ?? {};
        if (typeof email !== "string" ||
            typeof password !== "string") {
            res.status(400).json({ msg: 'all fields are required' });
            return;
        }
        const normalizedEmail = email.trim().toLowerCase();
        if (normalizedEmail.length > 254 || !EMAIL_REGEX.test(normalizedEmail)) {
            res.status(400).json({ msg: "invalid email form" });
            return;
        }
        const user = await prisma_1.prisma.user.findUnique({ where: { email: normalizedEmail } });
        if (!user) {
            res.status(401).json({ msg: "Email or password is incorrect" });
            return;
        }
        const ismatch = await bcrypt_1.default.compare(password, user.passwordHash);
        if (!ismatch) {
            res.status(401).json({ msg: "Email or password is incorrect" });
            return;
        }
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            res.status(500).json({ msg: "JWT secret is not configured" });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, jwtSecret, { expiresIn: '365d' });
        res.cookie("token", token, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", maxAge: 365 * 24 * 60 * 60 * 1000 });
        res.status(200).json({ msg: "Login successful", user: { id: user.id, email: user.email, name: user.name } });
        return;
    }
    catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ msg: "Something went wrong during login" });
        return;
    }
});
//same thing like tells who is it on the login session now with the userid of the cookie that is present in the browser 
authRouter.get("/auth/me", auth_1.default, async (req, res) => {
    try {
        const tokenId = req.userId;
        if (!tokenId) {
            res.status(401).json({ msg: "Unauthorized" });
            return;
        }
        const user = await prisma_1.prisma.user.findUnique({
            where: {
                id: tokenId
            },
            select: {
                id: true,
                email: true,
                name: true
            }
        });
        if (!user) {
            res.status(401).json({ msg: "User not found" });
            return;
        }
        res.status(200).json({ user });
        return;
    }
    catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ msg: "Something went wrong" });
        return;
    }
});
//this was some new stuff got in into clearing the present cookie from the broswer with the express method of clearing it 
//res.clearCookie with some property insdie it as usual to letting knwo what all stuff gotta remove 
authRouter.post("/auth/logout", (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production"
    });
    res.status(200).json({
        msg: "Logout successful"
    });
    return;
});
exports.default = authRouter;
//# sourceMappingURL=auth.js.map