"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AndarModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const andar_controller_1 = require("../controllers/andar.controller");
const andar_service_1 = require("../services/andar.service");
const andar_entity_1 = require("../entities/andar.entity");
const sala_entity_1 = require("../entities/sala.entity");
let AndarModule = class AndarModule {
};
exports.AndarModule = AndarModule;
exports.AndarModule = AndarModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([andar_entity_1.Andar, sala_entity_1.Sala])],
        controllers: [andar_controller_1.AndarController],
        providers: [andar_service_1.AndarService],
        exports: [andar_service_1.AndarService],
    })
], AndarModule);
//# sourceMappingURL=andar.module.js.map