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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sala = void 0;
const typeorm_1 = require("typeorm");
const andar_entity_1 = require("./andar.entity");
let Sala = class Sala {
};
exports.Sala = Sala;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Sala.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true, length: 50 }),
    __metadata("design:type", String)
], Sala.prototype, "numero_sala", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, length: 200 }),
    __metadata("design:type", String)
], Sala.prototype, "nome_ocupante", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Sala.prototype, "andarId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => andar_entity_1.Andar, andar => andar.salas, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'andarId' }),
    __metadata("design:type", andar_entity_1.Andar)
], Sala.prototype, "andar", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Sala.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Sala.prototype, "updatedAt", void 0);
exports.Sala = Sala = __decorate([
    (0, typeorm_1.Entity)('salas'),
    (0, typeorm_1.Index)(['numero_sala'], { unique: true }),
    (0, typeorm_1.Index)(['andarId']),
    (0, typeorm_1.Index)(['nome_ocupante'])
], Sala);
//# sourceMappingURL=sala.entity.js.map