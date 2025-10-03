"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AndarService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const andar_entity_1 = require("../entities/andar.entity");
const sala_entity_1 = require("../entities/sala.entity");
let AndarService = class AndarService {
    constructor(andarRepository, salaRepository) {
        this.andarRepository = andarRepository;
        this.salaRepository = salaRepository;
    }
    async findAll(page = 1, pageSize = 10000) {
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
    async findOne(id) {
        const andar = await this.andarRepository.findOne({ where: { id } });
        if (!andar) {
            throw new common_1.NotFoundException(`Andar com ID ${id} não encontrado`);
        }
        return { data: andar };
    }
    async create(createAndarDto) {
        const andar = this.andarRepository.create(createAndarDto);
        const savedAndar = await this.andarRepository.save(andar);
        return { data: savedAndar };
    }
    async update(id, updateAndarDto) {
        const andar = await this.andarRepository.findOne({ where: { id } });
        if (!andar) {
            throw new common_1.NotFoundException(`Andar com ID ${id} não encontrado`);
        }
        Object.assign(andar, updateAndarDto);
        const updatedAndar = await this.andarRepository.save(andar);
        return { data: updatedAndar };
    }
    async remove(id) {
        const andar = await this.andarRepository.findOne({
            where: { id },
            relations: ['salas']
        });
        if (!andar) {
            throw new common_1.NotFoundException(`Andar com ID ${id} não encontrado`);
        }
        await this.andarRepository.remove(andar);
    }
};
exports.AndarService = AndarService;
exports.AndarService = AndarService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(andar_entity_1.Andar)),
    __param(1, (0, typeorm_1.InjectRepository)(sala_entity_1.Sala)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], AndarService);
//# sourceMappingURL=andar.service.js.map