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
exports.SalaService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const sala_entity_1 = require("../entities/sala.entity");
let SalaService = class SalaService {
    constructor(salaRepository) {
        this.salaRepository = salaRepository;
    }
    async findAll(page = 1, pageSize = 10000) {
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
    async findOne(id) {
        const sala = await this.salaRepository.findOne({
            where: { id },
            relations: ['andar']
        });
        if (!sala) {
            throw new common_1.NotFoundException(`Sala com ID ${id} não encontrada`);
        }
        return { data: sala };
    }
    async create(createSalaDto) {
        const sala = this.salaRepository.create({
            numero_sala: createSalaDto.numero_sala,
            nome_ocupante: createSalaDto.nome_ocupante,
            andarId: createSalaDto.andar,
        });
        const savedSala = await this.salaRepository.save(sala);
        const salaWithAndar = await this.salaRepository.findOne({
            where: { id: savedSala.id },
            relations: ['andar']
        });
        return { data: salaWithAndar };
    }
    async update(id, updateSalaDto) {
        const sala = await this.salaRepository.findOne({ where: { id } });
        if (!sala) {
            throw new common_1.NotFoundException(`Sala com ID ${id} não encontrada`);
        }
        const updateData = { ...updateSalaDto };
        if (updateSalaDto.andar) {
            updateData.andarId = updateSalaDto.andar;
            delete updateData.andar;
        }
        Object.assign(sala, updateData);
        const updatedSala = await this.salaRepository.save(sala);
        const salaWithAndar = await this.salaRepository.findOne({
            where: { id: updatedSala.id },
            relations: ['andar']
        });
        return { data: salaWithAndar };
    }
    async remove(id) {
        const sala = await this.salaRepository.findOne({ where: { id } });
        if (!sala) {
            throw new common_1.NotFoundException(`Sala com ID ${id} não encontrada`);
        }
        await this.salaRepository.remove(sala);
    }
    async removeBatch(ids) {
        const success = [];
        const errors = [];
        try {
            const result = await this.salaRepository.delete(ids);
            success.push(...ids);
        }
        catch (error) {
            for (const id of ids) {
                try {
                    await this.remove(id);
                    success.push(id);
                }
                catch (err) {
                    errors.push({ id, error: err.message });
                }
            }
        }
        return { success, errors };
    }
};
exports.SalaService = SalaService;
exports.SalaService = SalaService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(sala_entity_1.Sala)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], SalaService);
//# sourceMappingURL=sala.service.js.map