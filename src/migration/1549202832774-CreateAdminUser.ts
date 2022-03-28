import { getRepository, MigrationInterface, QueryRunner } from 'typeorm';
import { UserEntity } from '../app/models/entities/users.entity';
import { WalletEntity } from '../app/models/entities/wallet.entity';

export class CreateAdminUser1547919837483 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const user = new UserEntity();
    user.username = 'admin';
    user.email = 'admin';
    user.password = 'admin';
    user.hashPassword();
    user.role = 'ADMIN';
    const userRepository = getRepository(UserEntity);
    let savedUser = await userRepository.save(user);

    const wallet = new WalletEntity();
    wallet.amount = 0;
    wallet.user_id = savedUser.id;

    const walletRepository = getRepository(WalletEntity);
    await walletRepository.save(wallet);
  }

  public async down(queryRunner: QueryRunner): Promise<any> { }
}
