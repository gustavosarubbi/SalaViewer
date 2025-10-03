import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Andar } from '../entities/andar.entity';
import { Sala } from '../entities/sala.entity';
import { CreateAndarDto, UpdateAndarDto } from '../entities/dto/andar.dto';

@Injectable()
export class AndarService {
  constructor(
    @InjectRepository(Andar)
    private andarRepository: Repository<Andar>,
    @InjectRepository(Sala)
    private salaRepository: Repository<Sala>,
  ) {}

  async findAll(page: number = 1, pageSize: number = 10000): Promise<{ data: Andar[], meta: any }> {
    const [andares, total] = await this.andarRepository.findAndCount({
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: { numero_andar: 'ASC' },
    });

    return {
      data: andares,
      meta: {
        pagination: {
          page,
          pageSize,
          pageCount: Math.ceil(total / pageSize),
          total,
        },
      },
    };
  }

  async findOne(id: number): Promise<{ data: Andar }> {
    const andar = await this.andarRepository.findOne({ where: { id } });
    if (!andar) {
      throw new NotFoundException(`Andar com ID ${id} não encontrado`);
    }
    return { data: andar };
  }

  async create(createAndarDto: CreateAndarDto): Promise<{ data: Andar }> {
    const andar = this.andarRepository.create(createAndarDto);
    const savedAndar = await this.andarRepository.save(andar);
    return { data: savedAndar };
  }

  async update(id: number, updateAndarDto: UpdateAndarDto): Promise<{ data: Andar }> {
    const andar = await this.andarRepository.findOne({ where: { id } });
    if (!andar) {
      throw new NotFoundException(`Andar com ID ${id} não encontrado`);
    }

    Object.assign(andar, updateAndarDto);
    const updatedAndar = await this.andarRepository.save(andar);
    return { data: updatedAndar };
  }

  async remove(id: number): Promise<void> {
    const andar = await this.andarRepository.findOne({ 
      where: { id },
      relations: ['salas']
    });
    
    if (!andar) {
      throw new NotFoundException(`Andar com ID ${id} não encontrado`);
    }

    // Usar cascade delete para otimizar performance
    await this.andarRepository.remove(andar);
  }
}
