import { Router } from 'express';
import UserController from '../app/controllers/UserController';
import WalletController from '../app/controllers/WalletController';
import {checkJWT} from "../middlewares/checkJWT";
import {checkUser} from "../middlewares/checkUser";

const router = Router();

// users
router.get('/', UserController.listAll);
router.get('/:id', [checkJWT,checkUser], UserController.getByOneId);
router.post('/', UserController.addNew);

// User Wallet
router.post('/transferFund', [checkJWT], WalletController​​.transferFund);
router.post('/fundWallet',[checkJWT], WalletController​​.fundUserWallet);
router.patch('/withdrawFund',[checkJWT], WalletController​​.fundWithdrawal);

export default router;
