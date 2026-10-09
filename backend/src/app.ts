import express from "express";
import cors from "cors";
import helmet from "helmet";
import notesRouter from "./routes/notes";
import authRouter from "./routes/auth";
import chatRouter from "./routes/chat";
import cookieParser from "cookie-parser";

const app = express();

app.use(helmet());
app.use(express.json({ limit: "100kb" }));
app.use(cors({
  origin: [
    "http://localhost:5000",
    "http://localhost:5173"
  ],
  credentials: true
}));
app.use(cookieParser());
app.set("trust proxy", 1);

app.use("/api", notesRouter);
app.use("/api", authRouter);
app.use("/api", chatRouter);

export default app;