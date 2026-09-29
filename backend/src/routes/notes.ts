import express, { Request, Response } from "express";
import { prisma } from "../lib/prisma";

const notesRouter = express.Router();

notesRouter.post("/notes", async (req: Request, res: Response) => {
  try {
    const { title, text, userId } = req.body ?? {};

    if (
      typeof title !== "string" || !title.trim() ||
      typeof text !== "string" || !text.trim() ||
      typeof userId !== "string" || !userId.trim()
    ) {
      res.status(400).json({ msg: "title, text and userId are required" });
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

notesRouter.get("/notes", async (_req: Request, res: Response) => {
  try {
    const notes = await prisma.notes.findMany();
    res.json(notes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Something went wrong" });
  }
});

export default notesRouter;