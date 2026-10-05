import express,{Request,Response} from "express";
import authenticateToken from "../middleware/auth";
import {prisma} from "../lib/prisma";
import groq,{GROQ_MODEL} from "../lib/groq";

const chatRouter=express.Router();

chatRouter.post("/notes/:id/chat",authenticateToken,async(req:Request,res:Response) => {
    try{
        const{message}=req.body ?? {};
        const userId=req.userId;
        const noteId=req.params.id;
        
        if(typeof message !== "string" || !message.trim() || message.length > 2000){
            res.status(400).json({msg:"Message is required and must be under 2000 characters"});
            return;
        }
        if(!userId){
            res.status(401).json({msg:"Unauthorized"});
            return;
        }
        if(typeof noteId !== "string"){
            res.status(400).json({msg:"Invalid note ID"});
            return;
        }

        const note=await prisma.notes.findFirst({
            where:{
                id: noteId,
                userID: userId,
            }
        });

        if(!note){
            res.status(404).json({msg:"Note not found"});
            return;
        }

        const chatCompletion=await groq.chat.completions.create({
            model: GROQ_MODEL,
            messages: [
                {
                    role:"user",
                    content:message
                }
            ],
        });
        const reply = chatCompletion.choices[0]?.message?.content ?? "";

        res.status(200).json({
            msg: "Chat response generated",
            reply,
        });

    }catch(error){
        console.error("Chat error:", error);
        res.status(500).json({msg:"Failed to generate chat response"});
    }
});

export default chatRouter;