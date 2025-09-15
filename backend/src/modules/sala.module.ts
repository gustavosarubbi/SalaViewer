import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SalaController } from '../controllers/sala.controller';
import { SalaService } from '../services/sala.service';
import { Sala } from '../entities/sala.entity';
import { Andar } from '../entities/andar.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Sala, Andar])],
  controllers: [SalaController],
  providers: [SalaService],
  exports: [SalaService],
})
export class SalaModule {}
