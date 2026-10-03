import express, { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import authenticateToken from "../middleware/auth";

const notesRouter = express.Router();
// Brought in authenticateToken so the user doesn't need to provide
// their userId manually. The userId is extracted from the verified JWT
// stored in the browser's HttpOnly cookie. 
notesRouter.post("/notes",authenticateToken, async (req: Request, res: Response) => {
  try {
    const { title, text } = req.body ?? {};
    const userId = req.userId;

    if (!userId) {
            res.status(401).json({ msg: "Unauthorized" });
            return;
        }
    if (
      typeof title !== "string" || !title.trim() ||
      typeof text !== "string" || !text.trim()
    ) {
      res.status(400).json({ msg: "title, text are required" });
      return;
    }

    const note = await prisma.notes.create({
      data: { title: title.trim(), text: text.trim(), userID: userId },
    });

    res.status(201).json(note);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Something went wrong" });
  }
});
//same here now the get request comes by a client browser fetches the cookies as per the req.userid 
//  finds the user and returns it data through DB basically req.userid is playing a major role in here 
//so that wahi userid ka db mile

notesRouter.get("/notes", authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    
    if(!userId){
      res.status(401).json({msg:"Unauthorized"});
      return;
    }

    const notes = await prisma.notes.findMany({where: {userID: userId}, orderBy: {createdAt: "desc"}});
    res.status(200).json(notes);
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Something went wrong" });
  }
});

export default notesRouter;