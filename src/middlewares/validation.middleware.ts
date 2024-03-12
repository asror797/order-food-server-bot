// import { plainToClass } from "class-transformer";
// import { ValidationError, validate } from "class-validator";
// import { NextFunction, Request, Response } from "express";

// export const validateRequest = (dtoClass: any) => {
//   return async (req: Request, res: Response, next: NextFunction) => {
//     const dtoInstance = plainToClass(dtoClass, req.body);
//     const errors = await validate(dtoInstance);
//     if (errors.length > 0) {
//       const errorMessages = errors.map((error: ValidationError) => Object.values(error.constraints)).join(', ');
//       return res.status(400).json({ error: errorMessages });
//     }
//     req.body = dtoInstance; // Replace req.body with validated DTO instance
//     next();
//   };
// };
