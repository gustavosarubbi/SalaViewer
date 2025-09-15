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
        try {
            console.log(`🗑️ Tentando deletar andar com ID: ${id}`);
            const andar = await this.andarRepository.findOne({
                where: { id },
                relations: ['salas']
            });
            if (!andar) {
                console.log(`❌ Andar com ID ${id} não encontrado`);
                throw new common_1.NotFoundException(`Andar com ID ${id} não encontrado`);
            }
            if (andar.salas && andar.salas.length > 0) {
                console.log(`⚠️ Andar ${andar.numero_andar} tem ${andar.salas.length} salas associadas. Deletando salas em lotes...`);
                const batchSize = 100;
                for (let i = 0; i < andar.salas.length; i += batchSize) {
                    const batch = andar.salas.slice(i, i + batchSize);
                    console.log(`🗑️ Deletando lote de ${batch.length} salas (${i + 1}-${i + batch.length} de ${andar.salas.length})`);
                    await Promise.all(batch.map(sala => this.salaRepository.remove(sala)));
                    if (i + batchSize < andar.salas.length) {
                        await new Promise(resolve => setTimeout(resolve, 50));
                    }
                }
                console.log(`✅ ${andar.salas.length} salas deletadas do andar ${andar.numero_andar}`);
            }
            console.log(`✅ Deletando andar ${andar.numero_andar} (ID: ${id})...`);
            await this.andarRepository.remove(andar);
            console.log(`✅ Andar ${id} deletado com sucesso`);
        }
        catch (error) {
            console.error(`❌ Erro ao deletar andar ${id}:`, error);
            throw error;
        }
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