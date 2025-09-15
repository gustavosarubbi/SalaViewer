import { Repository } from 'typeorm';
import { Andar } from '../entities/andar.entity';
import { Sala } from '../entities/sala.entity';
import { CreateAndarDto, UpdateAndarDto } from '../entities/dto/andar.dto';
export declare class AndarService {
    private andarRepository;
    private salaRepository;
    constructor(andarRepository: Repository<Andar>, salaRepository: Repository<Sala>);
    findAll(page?: number, pageSize?: number): Promise<{
        data: Andar[];
        meta: any;
    }>;
    findOne(id: number): Promise<{
        data: Andar;
    }>;
    create(createAndarDto: CreateAndarDto): Promise<{
        data: Andar;
    }>;
    update(id: number, updateAndarDto: UpdateAndarDto): Promise<{
        data: Andar;
    }>;
    remove(id: number): Promise<void>;
}
