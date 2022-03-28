import { NextFunction, Request, Response } from "express";

export interface IRequest extends Request {
  // In order to set a property in the request payload.
    [key: string]: any
  }