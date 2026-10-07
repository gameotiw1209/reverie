import express,{Request,Response} from "express";
import authenticateToken from "../middleware/auth";
import {prisma} from "../lib/prisma";
import groq,{GROQ_MODEL} from "../lib/groq";
import { NotebookDotIcon } from "lucide-react";

const chatRouter=express.Router();

chatRouter.post("/notes/:id/chat",authenticateToken,async(req:Request,res:Response) => {
    try{
        const{message}=req.body ?? {};
        const noteId=req.params.id;
        const userId=req.userId;

        if(!userId){
            res.status(401).json({msg:"Unauthorized"});
            return;
        }
        if(typeof message !== "string" || !message.trim() || message.trim().length > 2000){
            res.status(400).json({msg:"Message is required and must be under 2000 characters"});
            return;
        }
        if(typeof noteId !== "string"){
            res.status(400).json({msg:"Invalid note ID"});
            return;
        }
        const trimmedMessage=message.trim();
        const note=await prisma.notes.findFirst({
            where:{
                id:noteId,
                userID:userId
            }
        });
        if(!note){
            res.status(404).json({msg:"Note not found"});
            return;
        }
        const previousMessages=await prisma.chatMessage.findMany({
            where:{
                noteId:noteId,
                userId:userId
            },
            orderBy:{
                createdAt:"desc"
            },
            take:20
        });
        const history=previousMessages.reverse();
        const messages: {role:"system" | "user" | "assistant"; content:string}[]=[
            {
                role:"system",
                content:`You are Reverie, a reflective companion for a user's private journal.
                The following note is the user's own writing.
                Title: ${note.title}
                Note:${note.text}
                Answer based on the note and conversation history. Be warm, concise, and reflective.
                Do not invent facts or details that aren't present in the note or conversation.`
            },
            ...history.map((msg)=>({
                role:msg.role as "user" | "assistant",
                content:msg.content
            })),
            {
                role:"user",
                content:trimmedMessage
            }
        ];
        const chatCompletion=await groq.chat.completions.create({
            model:GROQ_MODEL,
            messages,
            max_completion_tokens:2000
        });
        const reply=chatCompletion.choices[0]?.message?.content?.trim() ?? "";
        if(!reply){
            res.status(500).json({msg:"AI returned an empty response"});
            return;
        }
        await prisma.$transaction([
            prisma.chatMessage.create({
                data:{
                    noteId:noteId,
                    userId:userId,
                    role:"user",
                    content:trimmedMessage
                }
            }),
            prisma.chatMessage.create({
                data:{
                    noteId:noteId,
                    userId:userId,
                    role:"assistant",
                    content:reply
                }
            })
        ]);
        res.status(200).json({
            msg:"Chat response generated",
            reply
        });

    }catch(error){
        console.error("Chat error:",error);
        const status=
            typeof error==="object" &&
            error!==null &&
            "status" in error
                ? Number((error as {status?:number}).status)
                : undefined;
        if(status===429){
            res.status(429).json({
                msg:"Too many requests. Please try again in a minute."
            });
            return;
        }
        res.status(500).json({
            msg:"Failed to generate chat response"
        });
        return;
    }
});
chatRouter.get("/notes/:id/chat",authenticateToken,async(req:Request,res:Response) => {
    try{
        const userid=req.userId;
        const noteId=req.params.id;
        if(!userid){
            res.status(401).json({msg:"Unauthorized"});
            return;
        }
        if(typeof noteId !== "string"){
            res.status(400).json({msg:"Invalid note ID"});
            return;
        }
        const chat=await prisma.chatMessage.findMany({
            where:{
                userId:userid,
                noteId
            },
            orderBy:{
                createdAt:"asc"
            }
        });
        res.status(200).json({chat});
    }catch(error){
        console.error("Chat history error:",error);
        res.status(500).json({msg:"Failed to retrieve chat history"});
    };

})
export default chatRouter;