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
    try {
      console.log(`🗑️ Tentando deletar sala com ID: ${id}`);
      
      const sala = await this.salaRepository.findOne({ where: { id } });
      if (!sala) {
        console.log(`❌ Sala com ID ${id} não encontrada`);
        throw new NotFoundException(`Sala com ID ${id} não encontrada`);
      }

      console.log(`✅ Sala encontrada: ${sala.numero_sala}, deletando...`);
      await this.salaRepository.remove(sala);
      console.log(`✅ Sala ${id} deletada com sucesso`);
    } catch (error) {
      console.error(`❌ Erro ao deletar sala ${id}:`, error);
      throw error;
    }
  }

  // Método otimizado para deleção em massa de salas
  async removeBatch(ids: number[]): Promise<{ success: number[], errors: { id: number, error: string }[] }> {
    const success: number[] = [];
    const errors: { id: number, error: string }[] = [];
    
    console.log(`🗑️ Iniciando deleção em massa de ${ids.length} salas`);
    
    // Processar em lotes de 100 para otimizar performance
    const batchSize = 100;
    for (let i = 0; i < ids.length; i += batchSize) {
      const batch = ids.slice(i, i + batchSize);
      console.log(`🗑️ Processando lote de ${batch.length} salas (${i + 1}-${i + batch.length} de ${ids.length})`);
      
      // Processar lote em paralelo
      const batchPromises = batch.map(async (id) => {
        try {
          await this.remove(id);
          success.push(id);
        } catch (error) {
          errors.push({ id, error: error.message });
        }
      });
      
      await Promise.all(batchPromises);
      
      // Pequena pausa entre lotes
      if (i + batchSize < ids.length) {
        await new Promise(resolve => setTimeout(resolve, 25));
      }
    }
    
    console.log(`✅ Deleção em massa concluída: ${success.length} sucessos, ${errors.length} erros`);
    return { success, errors };
  }
}
