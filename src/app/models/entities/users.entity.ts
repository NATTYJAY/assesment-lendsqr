import * as bcrypt from 'bcryptjs';
import { IsNotEmpty, Length } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { WalletEntity } from './wallet.entity';

@Entity({ name: 'users' })
@Unique(['email'])
export class UserEntity {
    [x: string]: any;
    @PrimaryGeneratedColumn()
    public id!: number;
  
    @Column()
    @Length(4, 100)
    public username!: string;
  
    @Column()
    @Length(4, 100)
    public email!: string;
  
    @Column()
    @Length(4, 100)
    public password!: string;
  
    @Column()
    @IsNotEmpty()
    public role!: string;
  
    @Column()
    @CreateDateColumn()
    public createdAt!: Date;
  
    @Column()
    @UpdateDateColumn()
    public updatedAt!: Date;

    @OneToMany(() => WalletEntity, (wallet: WalletEntity) => wallet.user, {
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    })
    wallet!: WalletEntity[];
  
    public hashPassword() {
      this.password = bcrypt.hashSync(this.password, 8);
    }
  
    public checkIfUnencryptedPasswordIsValid(unencryptedPassword: string) {
      return bcrypt.compareSync(unencryptedPassword, this.password);
    }
}