import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { createDatabaseConfig } from './database/database.config';
import { AndarModule } from './modules/andar.module';
import { SalaModule } from './modules/sala.module';
import { AuthModule } from './modules/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => [
        {
          ttl: configService.get<number>('THROTTLE_TTL') || 60000, // 1 minuto
          limit: configService.get<number>('THROTTLE_LIMIT') || 100, // 100 requests por minuto
        },
      ],
      inject: [ConfigService],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => createDatabaseConfig(configService),
      inject: [ConfigService],
    }),
    AndarModule,
    SalaModule,
    AuthModule,
  ],
})
export class AppModule {}
