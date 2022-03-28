import { IUserRepository } from "../Interfaces/IUserRepository";
import { UserEntity } from "../models/entities/users.entity";
import { getRepository } from 'typeorm';
import { Request } from 'express';
import { IUser } from '../models/User';
import APIError from '../global/response/apierror';
import Err from '../global/response/errorcode';
import * as bcrypt from 'bcryptjs';
import { WalletEntity } from "../models/entities/wallet.entity";

export class UserService implements IUserRepository {
    static add: any;
    
    async get(): Promise<UserEntity[] | null> {
        // Get users from database
        try {
            const userRepository = getRepository(UserEntity);
            const users = await userRepository.find({});
            return users;
        }
        catch (error) {
            return null
        }
    }
    async getById(id: number): Promise<UserEntity | null> {

        const userRepository = getRepository(UserEntity);
        
        try {
            const user = await userRepository.findOneOrFail(id);
            return user;
        } catch (error) {
            return null;
        }
    }

    async add(model: IUser): Promise<UserEntity | null> {
        const { username, role, password, email } = model;
        const user = new UserEntity();
        user.username = username;
        user.role = role;
        user.password = bcrypt.hashSync(password, 8);
        user.email = email;
        const userRepository = getRepository(UserEntity);
        const walletRepository = getRepository(WalletEntity);
        try {
            const savedUser = await userRepository.save(user);
            // As soon the user is created, his/her wallet will be created by default (0);
            const walletKeep  =  walletRepository.create({amount: 0, user_id:savedUser.id}); 
                                await walletRepository.save(walletKeep);
            return savedUser;
        } catch (e) {
            return Promise.reject(new APIError('User Already exists', Err.EmailAlreadyExists));
        }
    }
    async delete(id: number): Promise<UserEntity | null> {
        const userRepository = getRepository(UserEntity);
        let user: UserEntity;
        try {
            user = await userRepository.findOneOrFail(id);
            if (user) {
                userRepository.delete(id);
            }
            return null;
        } catch (error) {
            return null;
        }
    }

}