import { UserEntity } from "../models/entities/users.entity";

export interface IAuthInterface {
     login(user: UserEntity): any;
}