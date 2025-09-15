import { Repository } from 'typeorm';
import { Sala } from '../entities/sala.entity';
import { CreateSalaDto, UpdateSalaDto } from '../entities/dto/sala.dto';
export declare class SalaService {
    private salaRepository;
    constructor(salaRepository: Repository<Sala>);
    findAll(page?: number, pageSize?: number): Promise<{
        data: Sala[];
        meta: any;
    }>;
    findOne(id: number): Promise<{
        data: Sala;
    }>;
    create(createSalaDto: CreateSalaDto): Promise<{
        data: Sala;
    }>;
    update(id: number, updateSalaDto: UpdateSalaDto): Promise<{
        data: Sala;
    }>;
    remove(id: number): Promise<void>;
    removeBatch(ids: number[]): Promise<{
        success: number[];
        errors: {
            id: number;
            error: string;
        }[];
    }>;
}
