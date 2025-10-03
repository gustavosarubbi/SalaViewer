import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sala } from '../entities/sala.entity';
import { CreateSalaDto, UpdateSalaDto } from '../entities/dto/sala.dto';

@Injectable()
export class SalaService {
  constructor(
    @InjectRepository(Sala)
    private salaRepository: Repository<Sala>,
  ) {}

  async findAll(page: number = 1, pageSize: number = 10000): Promise<{ data: Sala[], meta: any }> {
    const [salas, total] = await this.salaRepository.findAndCount({
      relations: ['andar'],
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: { numero_sala: 'ASC' },
    });

    return {
      data: salas,
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

  async findOne(id: number): Promise<{ data: Sala }> {
    const sala = await this.salaRepository.findOne({ 
      where: { id },
      relations: ['andar']
    });
    if (!sala) {
      throw new NotFoundException(`Sala com ID ${id} não encontrada`);
    }
    return { data: sala };
  }

  async create(createSalaDto: CreateSalaDto): Promise<{ data: Sala }> {
    const sala = this.salaRepository.create({
      numero_sala: createSalaDto.numero_sala,
      nome_ocupante: createSalaDto.nome_ocupante,
      andarId: createSalaDto.andar,
    });
    const savedSala = await this.salaRepository.save(sala);
    
    // Buscar a sala com o relacionamento
    const salaWithAndar = await this.salaRepository.findOne({
      where: { id: savedSala.id },
      relations: ['andar']
    });
    
    return { data: salaWithAndar };
  }

  async update(id: number, updateSalaDto: UpdateSalaDto): Promise<{ data: Sala }> {
    const sala = await this.salaRepository.findOne({ where: { id } });
    if (!sala) {
      throw new NotFoundException(`Sala com ID ${id} não encontrada`);
    }

    const updateData: any = { ...updateSalaDto };
    if (updateSalaDto.andar) {
      updateData.andarId = updateSalaDto.andar;
      delete updateData.andar;
    }

    Object.assign(sala, updateData);
    const updatedSala = await this.salaRepository.save(sala);
    
    // Buscar a sala com o relacionamento
    const salaWithAndar = await this.salaRepository.findOne({
      where: { id: updatedSala.id },
      relations: ['andar']
    });
    
    return { data: salaWithAndar };
  }

  async remove(id: number): Promise<void> {
    const sala = await this.salaRepository.findOne({ where: { id } });
    if (!sala) {
      throw new NotFoundException(`Sala com ID ${id} não encontrada`);
    }

    await this.salaRepository.remove(sala);
  }

  // Método otimizado para deleção em massa de salas
  async removeBatch(ids: number[]): Promise<{ success: number[], errors: { id: number, error: string }[] }> {
    const success: number[] = [];
    const errors: { id: number, error: string }[] = [];
    
    // Usar delete direto para melhor performance
    try {
      const result = await this.salaRepository.delete(ids);
      success.push(...ids);
    } catch (error) {
      // Se falhar, tentar individualmente
      for (const id of ids) {
        try {
          await this.remove(id);
          success.push(id);
        } catch (err) {
          errors.push({ id, error: err.message });
        }
      }
    }
    
    return { success, errors };
  }
}
