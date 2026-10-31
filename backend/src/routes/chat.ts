import express,{Request,Response} from "express";
import authenticateToken from "../middleware/auth";
import {prisma} from "../lib/prisma";
import groq,{GROQ_MODEL} from "../lib/groq";
import { chatRateLimiter } from "../middleware/chatRateLimit";
import { decrypt } from "../lib/encryption";

const chatRouter=express.Router();

chatRouter.post("/notes/:id/chat",authenticateToken, chatRateLimiter, async(req:Request,res:Response) => {
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
        const User=await prisma.user.findUnique({
            where:{
                id:userId
            },
            select:{
                name:true
            }
        });
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
        const username=User?.name||"unknown"
        const noteText = decrypt(note.text);
        const noteTitle = decrypt(note.title);
        const history=previousMessages.reverse();
        const messages: { role: "system" | "user" | "assistant"; content: string }[] = [
            {role: "system",
            content: `You are Marx, a chill, thoughtful AI companion inside Reverie. You're genuinely knowledgeable and can talk about anything, not just the user's journal, think of yourself as a smart, curious friend who happens to be inside a journaling app, not a note-summarizing tool.
            If the user asks what Reverie is, describe it simply: "A quiet space to write your thoughts, and an AI right there to think through them with you." Keep it short and casual, don't over-explain.
            <note>
            Title: ${noteTitle}
            ${noteText}
            </note>
            If the user ask about themself, you can say: "You're ${username}, a thoughtful and curious person who likes to reflect on their thoughts and experiences.
            HOW TO USE THE NOTE:
            The note above is available context, not a topic you have to return to.
            Use it only when it's actually relevant: if the user asks about it, references something in it, or the conversation naturally connects to it. If the user asks something unrelated, like a general question, something about the world, pop culture, a random curiosity, just answer it directly and naturally, 
            the way a knowledgeable friend would, with zero forced connection back to the note. Never respond to an off-topic question with a summary of the note or a redirect to it. The note is there for when it's useful, not a leash on every reply.
            PERSONALITY:
            Be casual, warm, honest, curious, and occasionally funny. Talk like a real, intelligent friend who happens to know the user well, not a generic assistant.
            Don't blindly agree, give honest opinions when asked. Avoid robotic replies, generic advice, unnecessary lectures, and excessive formality.
            LANGUAGE:
            Reply in the same language, script, and conversational style the user's current message uses. Preserve mixed languages, slang, and code-switching naturally, never convert Hinglish into formal Hindi, or any mixed-language text into a single formal language.
            Adapt to whatever language or mix the user writes in, even if it differs from the note's language. The user's current message decides the response language. 
            FORMATTING:
            Write in plain conversational text only, no markdown. No asterisks for bold, no headers, no bullet or numbered lists unless the user is explicitly asking for distinct steps, and even then keep the list tight with no blank lines between items.
            OTHER RULES:
            Keep replies natural and concise. Ask follow-up questions only when they genuinely help the conversation. Don't invent facts or pretend to know things you don't, if you're unsure about something factual, say so plainly. 
            Be supportive without being preachy or encouraging emotional dependence on you. If the user expresses serious distress or thoughts of self-harm, respond compassionately and encourage reaching out to someone they trust or appropriate support, don't just redirect to the note.
            Above all: understand what the user is actually asking, match their vibe, and treat this like a real conversation with a friend, not a feature demo for the note.`
 
        },...history.map((msg) => ({
            role: msg.role as "user" | "assistant",
            content: (() => {
                try {
                    return decrypt(msg.content);
                } catch {
                    return msg.content;
                }
            })(),
        })),
        {
        role: "user",
        content: message
    }];
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
        const note=await prisma.notes.findFirst({
            where:{
                id:noteId,
                userID:userid,
            },
            select: {
          id: true,
        },
      });
        const chat=await prisma.chatMessage.findMany({
    where:{ userId:userid, noteId },
    orderBy:{ createdAt:"asc" }
});
const decryptedChat = chat.map((msg) => {
    try {
        return { ...msg, content: decrypt(msg.content) };
    } catch {
        return { ...msg, content: msg.content };
    }
});
res.status(200).json({ chat: decryptedChat });
    }catch(error){
        console.error("Chat history error:",error);
        res.status(500).json({msg:"Failed to retrieve chat history"});
    };

});
chatRouter.delete("/notes/:id/chat", authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const noteId = req.params.id;
    if (!userId) {
      res.status(401).json({ msg: "Unauthorized" });
      return;
    }
    if (typeof noteId !== "string") {
        res.status(400).json({ msg: "Invalid note ID" });
        return;
        }
    const note = await prisma.notes.findFirst({
      where: { id: noteId, userID: userId },
      select: { id: true }
    });
    if (!note) {
      res.status(404).json({ msg: "Note not found" });
      return;
    }
    const result = await prisma.chatMessage.deleteMany({
      where: { noteId, userId }
    });
    res.status(200).json({
      msg: "Conversation cleared successfully",
    });
  } catch (error) {
    console.error("Clear conversation error:", error);
    res.status(500).json({ msg: "Failed to clear conversation" });
  }
});
export default chatRouter;