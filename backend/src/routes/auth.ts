import express, {Request,Response} from "express";
import jwt from "jsonwebtoken";
import { Prisma } from "../generated/client";
import bcrypt from "bcrypt";
import authenticateToken from "../middleware/auth";
import { prisma } from "../lib/prisma";

const authRouter = express.Router();
console.log("AUTH ROUTER LOADED");
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

authRouter.post('/auth/signup',async(req:Request,res:Response) => {
    try{
        const{ email,password,name }= req.body ?? {};

        if (
            typeof email !=="string" ||
            typeof password !== "string" ||
            typeof name !== "string"
        ){
            res.status(400).json({msg:'all fields are required'});
            return;
        }
        const normalizedEmail = email.trim().toLowerCase();

        if(normalizedEmail.length > 254 || !EMAIL_REGEX.test(normalizedEmail)){
            res.status(400).json({msg:"invalid email form"});
            return;
        }

        if(password.length < 8 || password.length > 64) {
            res.status(400).json({msg:"password must be greater then 8 characters"});
            return;
        }
        if(name.length > 50){
            res.status(400).json({msg:"name can't be this big sybau"});
            return;
        }
        const passwordHash = await bcrypt.hash(password,12);

        const newUser = await prisma.user.create({
            data:{
                email:normalizedEmail,
                name:name,
                passwordHash
            },
            select:{
                id:true,
                email:true
            },
        });
        res.status(201).json({msg:"user CREATED SUCCESSFULLY",newUser});
        return;
    } catch (error) {
        // duplicate EMAIL
        if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === "P2002"
        ) {
            res.status(409).json({ msg: "email already registered" });
            return;
        }
        console.error("Error creating user: ", error);
        res.status(500).json({ error: "Error creating user" });
        return;
    }
});

authRouter.post('/auth/login',async(req:Request,res:Response)=>{
    console.log("LOGIN ROUTE HIT");
    try{
        const{ email,password }= req.body ?? {};
        if (
            typeof email !=="string" ||
            typeof password !== "string"
        ){
            res.status(400).json({msg:'all fields are required'})
            return;
        }
        const normalizedEmail = email.trim().toLowerCase();

        if(normalizedEmail.length > 254 || !EMAIL_REGEX.test(normalizedEmail)){
            res.status(400).json({msg:"invalid email form"});
            return;
        }
        const user=await prisma.user.findUnique({where :{email : normalizedEmail} });
        if(!user){
            res.status(401).json({msg:"Email or password is incorrect"});
            return;
        }
        const ismatch=await bcrypt.compare(password, user.passwordHash);
        if(!ismatch){
             res.status(401).json({msg:"Email or password is incorrect"});
             return;
        }
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            res.status(500).json({ msg: "JWT secret is not configured" });
            return;
        }
        const token = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: '365d' });
        
        res.cookie("token",token,{httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production",maxAge :365 * 24 * 60 * 60 * 1000});

        res.status(200).json({msg:"Login successful",user:{id:user.id,email:user.email,name:user.name}});
        return;
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ msg: "Something went wrong during login" });
        return;
    }
});
authRouter.get("/auth/me", authenticateToken, async (req: Request, res: Response) => {
    try {
        const tokenId = req.userId;

        if (!tokenId) {
            res.status(401).json({ msg: "Unauthorized" });
            return;
        }
        const user = await prisma.user.findUnique({
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
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ msg: "Something went wrong" });
        return;
    }
});
authRouter.post("/auth/logout", (req: Request, res: Response) => {
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

export default authRouter;