import * as bcrypt from 'bcryptjs';
import { IsNotEmpty, Length } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from './users.entity';

@Entity({name: 'wallet'})
export class WalletEntity {
    @PrimaryGeneratedColumn()
    public id!: number;
  
    @Column({nullable: false, default:0})
    public amount!: number;
    
    @Column()
    @CreateDateColumn()
    public createdAt!: Date;
  
    @Column()
    @UpdateDateColumn()
    public updatedAt!: Date;

    @Column({ type: "int", nullable: true })
    user_id: number | undefined;

    @ManyToOne(() => UserEntity, (user: UserEntity) => user.wallet, { eager: true, onDelete: 'CASCADE' })
    // `JoinColumn` can be used on both one-to-one and many-to-one relations to specify custom column name
    // or custom referenced column.
    @JoinColumn({ name: 'user_id' })
    user!: UserEntity;

}