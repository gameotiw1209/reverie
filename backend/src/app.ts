import express from "express";
import notesRouter from "./routes/notes";
import authRouter from "./routes/auth";
import cookieParser from "cookie-parser";
import chatRouter from "./routes/chat";

const app=express()
app.use(express.json());
app.use(cookieParser());

app.use("/api",notesRouter);
app.use("/api", authRouter);
app.use("/api",chatRouter);

export default app;