import express, { Request, Response } from "express";
const app = express();

app.get("/",(req:Request,res:Response)=>{
    res.send("yo back at it huhhh :)!!!")
})
export default app;
