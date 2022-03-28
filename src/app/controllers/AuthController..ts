import { Request, Response, NextFunction } from 'express';
import Template from '../global/response';
import { AuthService ​​} from '../services/AuthService';
import { ServerException } from '../../lib/custom-errors';
import { Logger } from '../../lib/logger';
import APIError from '../global/response/apierror';

const logger: any = new Logger();

const authService = new AuthService​​();

class AuthController {
  public static login = async (req: Request, res: Response, next:NextFunction) => {
    authService.login(req.body).then(users => {
        res.json(Template.success(users, 'User Login succesfully'));
    }).catch(err=> {
      if (err.ErrorID == 2000) {
        next(new APIError(err.message, err.ErrorID));
      }
        next(new ServerException('error occured'));
    })
  };
}

export default AuthController;