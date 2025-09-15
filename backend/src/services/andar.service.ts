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
    try {
      console.log(`🗑️ Tentando deletar andar com ID: ${id}`);
      
      const andar = await this.andarRepository.findOne({ 
        where: { id },
        relations: ['salas'] // Carregar salas relacionadas
      });
      
      if (!andar) {
        console.log(`❌ Andar com ID ${id} não encontrado`);
        throw new NotFoundException(`Andar com ID ${id} não encontrado`);
      }

      // Se há salas associadas, deletar elas primeiro em lotes
      if (andar.salas && andar.salas.length > 0) {
        console.log(`⚠️ Andar ${andar.numero_andar} tem ${andar.salas.length} salas associadas. Deletando salas em lotes...`);
        
        // Deletar salas em lotes de 100 para otimizar performance
        const batchSize = 100;
        for (let i = 0; i < andar.salas.length; i += batchSize) {
          const batch = andar.salas.slice(i, i + batchSize);
          console.log(`🗑️ Deletando lote de ${batch.length} salas (${i + 1}-${i + batch.length} de ${andar.salas.length})`);
          
          // Deletar lote em paralelo para melhor performance
          await Promise.all(batch.map(sala => this.salaRepository.remove(sala)));
          
          // Pequena pausa entre lotes para não sobrecarregar o banco
          if (i + batchSize < andar.salas.length) {
            await new Promise(resolve => setTimeout(resolve, 50));
          }
        }
        
        console.log(`✅ ${andar.salas.length} salas deletadas do andar ${andar.numero_andar}`);
      }

      // Agora deletar o andar
      console.log(`✅ Deletando andar ${andar.numero_andar} (ID: ${id})...`);
      await this.andarRepository.remove(andar);
      console.log(`✅ Andar ${id} deletado com sucesso`);
      
    } catch (error) {
      console.error(`❌ Erro ao deletar andar ${id}:`, error);
      throw error;
    }
  }
}
