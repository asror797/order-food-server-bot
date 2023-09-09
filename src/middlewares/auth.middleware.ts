import { NextFunction, Request, Response } from "express";
import { RequestWithUser } from "../interfaces/auth.interface";



const authMiddleware = async(req:RequestWithUser,res:Response,next:NextFunction) => {
  try {
    const Authorization = req.header('Authorization')?.split('Bearer ')[1] || null 
    if(Authorization) {
      console.log("ok")
    }
    
  } catch (error) {
    console.log(error);
  }
}


export default authMiddleware;