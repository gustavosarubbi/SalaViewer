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
exports.AndarController = void 0;
const common_1 = require("@nestjs/common");
const andar_service_1 = require("../services/andar.service");
const andar_dto_1 = require("../entities/dto/andar.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
let AndarController = class AndarController {
    constructor(andarService) {
        this.andarService = andarService;
    }
    create(createAndarDto) {
        return this.andarService.create(createAndarDto);
    }
    findAll(page, pageSize) {
        const pageNum = page ? parseInt(page) : 1;
        const pageSizeNum = pageSize ? parseInt(pageSize) : 10000;
        return this.andarService.findAll(pageNum, pageSizeNum);
    }
    findOne(id) {
        return this.andarService.findOne(id);
    }
    update(id, updateAndarDto) {
        return this.andarService.update(id, updateAndarDto);
    }
    remove(id) {
        return this.andarService.remove(id);
    }
};
exports.AndarController = AndarController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('admin'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [andar_dto_1.CreateAndarDto]),
    __metadata("design:returntype", void 0)
], AndarController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)('admin'),
    __param(0, (0, common_1.Query)('pagination[page]')),
    __param(1, (0, common_1.Query)('pagination[pageSize]')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], AndarController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)('admin'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], AndarController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)('admin'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, andar_dto_1.UpdateAndarDto]),
    __metadata("design:returntype", void 0)
], AndarController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)('admin'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], AndarController.prototype, "remove", null);
exports.AndarController = AndarController = __decorate([
    (0, common_1.Controller)('andares'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [andar_service_1.AndarService])
], AndarController);
//# sourceMappingURL=andar.controller.js.map