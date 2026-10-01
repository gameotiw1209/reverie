import express from "express";
import notesRouter from "./routes/notes";
import authRouter from "./routes/auth";

const app=express()
app.use(express.json())

app.use("/api",notesRouter);
app.use("/api", authRouter);

export default app;