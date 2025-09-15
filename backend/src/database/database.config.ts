import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Andar } from '../entities/andar.entity';
import { Sala } from '../entities/sala.entity';
import { User } from '../entities/user.entity';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'sqlite',
  database: 'database/salaviewer.db',
  entities: [Andar, Sala, User],
  synchronize: true, // Apenas para desenvolvimento
  logging: false,
  migrations: [],
  subscribers: [],
};
