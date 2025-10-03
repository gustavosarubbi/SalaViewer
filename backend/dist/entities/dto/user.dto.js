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
exports.LoginDto = exports.CreateUserDto = void 0;
const class_validator_1 = require("class-validator");
class CreateUserDto {
}
exports.CreateUserDto = CreateUserDto;
__decorate([
    (0, class_validator_1.IsEmail)({}, { message: 'Email deve ter um formato válido' }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'Senha deve ser uma string' }),
    (0, class_validator_1.MinLength)(8, { message: 'Senha deve ter pelo menos 8 caracteres' }),
    (0, class_validator_1.Matches)(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, { message: 'Senha deve conter pelo menos: 1 letra minúscula, 1 maiúscula, 1 número e 1 caractere especial' }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'Username deve ser uma string' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Username não pode estar vazio' }),
    (0, class_validator_1.MinLength)(3, { message: 'Username deve ter pelo menos 3 caracteres' }),
    (0, class_validator_1.MaxLength)(50, { message: 'Username deve ter no máximo 50 caracteres' }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "username", void 0);
class LoginDto {
}
exports.LoginDto = LoginDto;
__decorate([
    (0, class_validator_1.IsEmail)({}, { message: 'Email deve ter um formato válido' }),
    __metadata("design:type", String)
], LoginDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'Senha deve ser uma string' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Senha não pode estar vazia' }),
    __metadata("design:type", String)
], LoginDto.prototype, "password", void 0);
//# sourceMappingURL=user.dto.js.map