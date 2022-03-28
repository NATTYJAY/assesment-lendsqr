import { IWalletInterface } from '../Interfaces/IWalletInterface';
import { WalletEntity } from '../models/entities/wallet.entity';
import { getRepository } from 'typeorm';
import { UserEntity } from '../models/entities/users.entity';
import APIError from '../global/response/apierror';
import Err from '../global/response/errorcode';
export class WalletService {

    async transferFund(userPayload:IWalletInterface,data:IWalletInterface):Promise<object> {
        const { userId, amount} = data;
        const { logInUserId } = userPayload;
        const walletRepository = getRepository(WalletEntity);
        let userRepository = getRepository(UserEntity);
        let userWallet;
        let userDebitedWallet;
        // Check if user exits and wallet has been created first.
        if (!(userId)) {
            return Promise.reject(new APIError('UserID is required', Err.ValidationFailed));
        }else if(!(amount)){
            return Promise.reject(new APIError('Amount is required', Err.ValidationFailed));
        }
        try{
            // Check if the requested user is created;
            let findUser = await userRepository.find({
                where: {
                    id: userId
                },
            });
            // Check to see if user is created on the system
            if(findUser.length > 0){
                // If user is created in the application
                try{
                    userDebitedWallet = await walletRepository.createQueryBuilder("wallet")
                    .where("user_id = :user_id", { user_id: logInUserId })
                    .getOne();
                    if(!userDebitedWallet){
                        return Promise.reject(new APIError('Auth does not have a wallet', Err.ValidationFailed));
                    }
                    if(userDebitedWallet.amount > amount){
                        userWallet = await walletRepository.createQueryBuilder("wallet")
                        .where("user_id = :user_id", { user_id: userId })
                        .getOne();
                        // If existing user does not have a wallet 
                        if(!userWallet){
                            return Promise.reject(new APIError('No wallet created for this user', Err.ValidationFailed));
                        }
                        // Update the exisiting wallet for the requested user;
                        const creditedAmount = userWallet.amount + amount;
                        const debitedAmount = userDebitedWallet.amount - amount;
                                
                         await walletRepository.update({user_id:userId},{ amount: creditedAmount });
                        return await walletRepository.update({user_id:logInUserId},{ amount: debitedAmount });
                    }
                                
                    return Promise.reject(new APIError('No sufficient funds', Err.NoSufficientAmount));
                    
                }catch(error){
                    return Promise.reject(error);
                }
            }
            else{
                return Promise.reject(new APIError('User Not Found', Err.UserNotFound));
            }
            }catch(error){
            return Promise.reject(error);
        }
    }

    async fundUserWallet(userPayload:IWalletInterface,data:IWalletInterface):Promise<object>{
        const { userId } = userPayload;
        const { amount } = data;
        const walletRepository = getRepository(WalletEntity);
        let userWallet;

        if(!(amount)){
            return Promise.reject(new APIError('Amount is required', Err.ValidationFailed));
        }
            //check if the login user already has a wallet
        try{
            // If the current user does not already has a wallet, set one
            userWallet = await walletRepository.createQueryBuilder("wallet")
                                .where("user_id = :user_id", { user_id: userId })
                                .getOne();
            if(!userWallet){
                const walletKeep  =  walletRepository.create({amount: amount, user_id:userId}); 
                return  await walletRepository.save(walletKeep);
            }
             // Update the existing wallet for the requested user;
             const newWalletAmount = userWallet.amount + amount;
             return  await walletRepository.update({user_id:userId},{ amount: newWalletAmount });

        }catch(error){
            return Promise.reject(error);
        }
    }

    async fundWithdrawal(userPayload:IWalletInterface,data:IWalletInterface):Promise<object>{
        const { userId } = userPayload;
        const { amount } = data;
        const walletRepository = getRepository(WalletEntity);
        let userWallet;

        if(!(amount)){
            return Promise.reject(new APIError('Amount is required', Err.ValidationFailed));
        }
        try{
            // Check user's wallet
            userWallet = await walletRepository.createQueryBuilder("wallet")
                                .where("user_id = :user_id", { user_id: userId })
                                .getOne();
            if(!userWallet){
                return Promise.reject(new APIError('No wallet created for this user', Err.ValidationFailed));
            }
            // Check if user has sufficient amount to withdraw
            if(userWallet.amount > amount){
                const newWalletAmount = userWallet.amount - amount;
                return  await walletRepository.update({user_id:userId},{ amount: newWalletAmount });
            }
            return Promise.reject(new APIError('No sufficient funds', Err.NoSufficientAmount));

        }catch(error){
            return Promise.reject(error);
        }
    }

}