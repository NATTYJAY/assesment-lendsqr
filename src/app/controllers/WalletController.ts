import { Request, Response, NextFunction } from 'express';
import { WalletService } from '../services/WalletService';
import Template from '../global/response';
import { ServerException } from '../../lib/custom-errors';
import { Logger } from '../../lib/logger';
import APIError from '../global/response/apierror';
import { IRequest } from '../Interfaces/IRequest';
import { any } from 'bluebird';

const walletService = new WalletService();
const logger  = new Logger();
class WalletController{

    public static transferFund = async (req:IRequest, res:Response, next:NextFunction) => {
        
        let userLogin:any  = {};
            userLogin.logInUserId = req.payload.userId;
        walletService.transferFund(userLogin,req.body).then(result => {
            if(result){
                res.json(Template.successMessage('Funds Transfer successfully'));
            }
        }).catch(err => {
            if (err.ErrorID == 2000) {
                next(new APIError(err.message, err.ErrorID));
            }else if(err.ErrorID = 3400){
                next(new APIError(err.message, err.ErrorID));
            }
            next(new ServerException(err));
        });
    }

    public static fundUserWallet = async (req:IRequest, res:Response, next: NextFunction) => {
        walletService.fundUserWallet(req.payload, req.body).then(result => {
            if(result){
                res.json(Template.successMessage('Transaction successful'));
            }
        }).catch(err => {
            if(err.ErrorID = 3400){
                next(new APIError(err.message, err.ErrorID));
            }
            next(new ServerException(err));
        });
    }

    public static fundWithdrawal = async (req: IRequest, res:Response, next:NextFunction) => {
        walletService.fundWithdrawal(req.payload, req.body).then(result => {
            if(result){
                res.json(Template.successMessage('Transaction successful'));
            }
        }).catch(err => {
            if(err.ErrorID = 3400){
                next(new APIError(err.message, err.ErrorID));
            }
            next(new ServerException(err));
        });
    }
}

export default WalletController;