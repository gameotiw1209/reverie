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
    "http://localhost:3000",
    "https://reverienote.vercel.app",
  ],
  credentials: true
}));
app.use(cookieParser());
app.set("trust proxy", 1);

app.use("/api", notesRouter);
app.use("/api", authRouter);
app.use("/api", chatRouter);
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "server chalu" });
});

export default app;