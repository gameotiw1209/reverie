import express, {Request,Response} from "express";
import jwt from "jsonwebtoken";
import { Prisma } from "@prisma/client";
import bcrypt from "bcrypt";
import authenticateToken from "../middleware/auth";
import { prisma } from "../lib/prisma";

const authRouter = express.Router();

authRouter.post('/auth/signup',async(req:Request,res:Response) => {
    try{
        const{ email,password }= req.body ?? {};

        if (
            typeof email !=="string" ||
            typeof password !== "string"
        ){
            return res.status(400).json({msg:'all fields are required'})
        }
        const normalizedEmail = email.trim().toLowerCase();
        const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if(normalizedEmail.length > 254 || !EMAIL_REGEX.test(normalizedEmail)){
            res.status(400).json({msg:"invalid email form"});
            return;
        }

        if(password.length < 8 || password.length > 64) {
            res.status(400).json({msg:"password must be greater then 8 characters"});
            return;
        }

        const passwordHash = await bcrypt.hash(password,12);

        const newUser = await prisma.user.create({
            data:{
                email:normalizedEmail,
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
            return res.status(409).json({ msg: "email already registered" });
        }
        console.error("Error creating user: ", error);
        return res.status(500).json({ error: "Error creating user" });
    }
});