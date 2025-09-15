import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AndarController } from '../controllers/andar.controller';
import { AndarService } from '../services/andar.service';
import { Andar } from '../entities/andar.entity';
import { Sala } from '../entities/sala.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Andar, Sala])],
  controllers: [AndarController],
  providers: [AndarService],
  exports: [AndarService],
})
export class AndarModule {}
