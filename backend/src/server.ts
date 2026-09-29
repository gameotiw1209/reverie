import express, { Request, Response } from "express"
import app from "./app"
import "dotenv/config";

app.listen(5000,()=>{
    console.log("server starting at port 5000")
})
