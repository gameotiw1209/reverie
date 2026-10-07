import Groq from "groq-sdk";
import { configDotenv } from "dotenv";
configDotenv();

const groq = new Groq({
        apiKey:process.env.GROQ_API_KEY
});
export const GROQ_MODEL = process.env.GROQ_MODEL!;

export default groq;