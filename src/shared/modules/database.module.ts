import { Global, Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/modules/users/user.entity';
import { databaseConfig } from 'src/configs/database.config';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...(databaseConfig.postgres as any),
      entities: [User]
    })
  ],
  exports: [TypeOrmModule]
})
export class DatabaseModule {}
