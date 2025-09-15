import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { databaseConfig } from './database/database.config';
import { AndarModule } from './modules/andar.module';
import { SalaModule } from './modules/sala.module';
import { AuthModule } from './modules/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(databaseConfig),
    AndarModule,
    SalaModule,
    AuthModule,
  ],
})
export class AppModule {}
