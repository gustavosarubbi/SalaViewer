import { SalaService } from '../services/sala.service';
import { CreateSalaDto, UpdateSalaDto } from '../entities/dto/sala.dto';
export declare class SalaController {
    private readonly salaService;
    constructor(salaService: SalaService);
    create(createSalaDto: CreateSalaDto): Promise<{
        data: import("../entities/sala.entity").Sala;
    }>;
    findAll(page?: string, pageSize?: string, populate?: string): Promise<{
        data: import("../entities/sala.entity").Sala[];
        meta: any;
    }>;
    findOne(id: number, populate?: string): Promise<{
        data: import("../entities/sala.entity").Sala;
    }>;
    update(id: number, updateSalaDto: UpdateSalaDto): Promise<{
        data: import("../entities/sala.entity").Sala;
    }>;
    remove(id: number): Promise<void>;
}
