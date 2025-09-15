import { AndarService } from '../services/andar.service';
import { CreateAndarDto, UpdateAndarDto } from '../entities/dto/andar.dto';
export declare class AndarController {
    private readonly andarService;
    constructor(andarService: AndarService);
    create(createAndarDto: CreateAndarDto): Promise<{
        data: import("../entities/andar.entity").Andar;
    }>;
    findAll(page?: string, pageSize?: string): Promise<{
        data: import("../entities/andar.entity").Andar[];
        meta: any;
    }>;
    findOne(id: number): Promise<{
        data: import("../entities/andar.entity").Andar;
    }>;
    update(id: number, updateAndarDto: UpdateAndarDto): Promise<{
        data: import("../entities/andar.entity").Andar;
    }>;
    remove(id: number): Promise<void>;
}
