import { UserEntity } from "../models/entities/users.entity";

export interface IUserRepository {
     get(): Promise<UserEntity[] | null>;
     getById(id: number): Promise<UserEntity | null>;
     add(user: UserEntity): Promise<UserEntity | null>;
     delete(id: number): Promise<UserEntity | null>;
}