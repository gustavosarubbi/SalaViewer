import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Andar } from '../entities/andar.entity';
import { Sala } from '../entities/sala.entity';
import { User } from '../entities/user.entity';

export const createDatabaseConfig = (configService: ConfigService): TypeOrmModuleOptions => ({
  type: 'sqlite',
  database: configService.get<string>('DATABASE_PATH') || 'database/salaviewer.db',
  entities: [Andar, Sala, User],
  synchronize: configService.get<string>('NODE_ENV') !== 'production',
  logging: configService.get<string>('NODE_ENV') === 'development',
  migrations: [],
  subscribers: [],
});
