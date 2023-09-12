import { NextFunction, Request, Response } from "express";
import { RequestWithUser } from "../interfaces/auth.interface";
import { httException } from "../exceptions/httpException";
import { verify } from "jsonwebtoken";



const authMiddleware = async(req:RequestWithUser,res:Response,next:NextFunction) => {
  try {
    const Authorization = req.header('Authorization')?.split('Bearer ')[1] || null 

    if(!Authorization) throw new httException(401,'unauthorized');
    const url = req.url

      if(url == '/docs' || url == '/auth/login') {
        return next();
      } else {
        if(Authorization) {
          const verificationResponse = verify(Authorization, 'secret_key') as any 

          if(verificationResponse) {
              req.user = verificationResponse
              next()
          } else {
              next( new httException(401,'Wrong authenticaton token'))
          }
        }
      } 
  } catch (error)  {
    next(error)
  }
}

export default authMiddleware;