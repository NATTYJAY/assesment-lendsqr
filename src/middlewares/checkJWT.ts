import { NextFunction, Request, Response } from "express";
import * as jwt from 'jsonwebtoken'
import { IRequest } from "../app/Interfaces/IRequest";
import { Logger } from "../lib/logger";

const logger: any = new Logger();

export const checkJWT = (req: IRequest, res: Response, next: NextFunction) => {
  const reqHeader =  req.headers.authorization;
  if(!reqHeader){
      res.status(401).json({'message' : 'auth token not provided'})
  }
  const token = reqHeader?.split(" ")[1] as string;
   let jwtPayload;
  
  try {
    jwtPayload = <any>jwt.verify(token, "configjwtSecret");
    req.payload = jwtPayload;
    
  }catch(err){
      res.status(401).json({error: ''+ err});
      return;
  }
  //The token is valid for 1 hour
  //We want to send a new token on every request
  const { userId, username } = jwtPayload;
  const newToken = jwt.sign({ userId, username }, "configjwtSecret", {
    expiresIn: "1h"
  });
  res.setHeader("token", newToken);
  next();
}