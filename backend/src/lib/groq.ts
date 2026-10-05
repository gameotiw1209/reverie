import Groq from "groq-sdk";

const groq = new Groq({
        apiKey:process.env.GROQ_API_KEY
});
export const GROQ_MODEL = process.env.GROQ_MODEL!;

export default groq;