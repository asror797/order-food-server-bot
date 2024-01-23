import { NextFunction, Request, Response } from "express";

export const checkPermission = async(req:Request,res:Response,next:NextFunction) => {
  try {
    
  } catch (error) {
    next(error)
  }
}
