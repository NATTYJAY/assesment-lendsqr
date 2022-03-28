import { NextFunction, Request, Response } from "express";
import { Logger } from "../lib/logger";
import { IRequest } from "../app/Interfaces/IRequest";
const logger: any = new Logger();

export const checkUser = (req: IRequest, res: Response, next: NextFunction) => {
  const curentUserId = req.payload.userId;
  if(curentUserId === Number(req.params.id)){
    next();
  } else {
      res.status(401).json({'message' : 'you are not allowed for this operations'})
  }
}