import express, { Request, Response } from "express";
const app = express();

app.get("/",(req:Request,res:Response)=>{
    res.send("yo back at it huhhh :)!!!")
})
app.listen(5000,()=>{
    console.log("server starting at port 5000")
})

export default app;