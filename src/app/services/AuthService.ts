import { UserEntity } from "../models/entities/users.entity";
import {IAuthInterface} from "../Interfaces/IAuthInterface";
import { IUserInterface } from '../Interfaces/IUserInterface';
import { getRepository } from 'typeorm';
import APIError from "../global/response/apierror";
import Err from "../global/response/errorcode";
import * as jwt from 'jsonwebtoken';

export class AuthService​​ implements IAuthInterface{

    async login(model:IUserInterface){
        const { username, password } = model;
            
        if (!(username && password)) {
            return Promise.reject(new APIError('Email or Password is invalid', Err.InvalidCredentials));
        }
        const userRepository = getRepository(UserEntity);
        let user: UserEntity | undefined;
        try{
            user = await userRepository
                        .createQueryBuilder('user')
                        .addSelect('user.password')
                        .where('user.username = :username', { username })
                        .getOne();

        }catch(err){
            return Promise.reject(err);
        }
         // //Check if encrypted password match
        if (!user?.checkIfUnencryptedPasswordIsValid(password)) {
            return Promise.reject(new APIError('User Not Found', Err.UserNotFound));
        }
        //Sing JWT, valid for 1 hour
        const token = jwt.sign({ userId: user.id, username: user.username }, 'configjwtSecret', {
        expiresIn: '1h',
        });
        try{
            return Promise.resolve({user, accessToken:token});
        }catch(err){
            return null;
        }

        
    }
}