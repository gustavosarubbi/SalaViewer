"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcryptjs"));
const user_entity_1 = require("../entities/user.entity");
let AuthService = class AuthService {
    constructor(userRepository, jwtService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }
    async login(loginDto) {
        const user = await this.validateUser(loginDto.email, loginDto.password);
        if (!user) {
            throw new common_1.UnauthorizedException('Credenciais inválidas');
        }
        const payload = { email: user.email, sub: user.id };
        return {
            jwt: this.jwtService.sign(payload),
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                role: user.role
            }
        };
    }
    async validateUser(email, password) {
        const user = await this.userRepository.findOne({ where: { email } });
        if (!user || !user.isActive) {
            return null;
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return null;
        }
        return user;
    }
    async createAdminUser() {
        const existingAdmin = await this.userRepository.findOne({
            where: { email: 'admin@esalas.com' }
        });
        const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
        console.log('🔑 Senha do admin:', adminPassword);
        const hashedPassword = await bcrypt.hash(adminPassword, 10);
        if (existingAdmin) {
            console.log('👤 Usuário admin existente encontrado, atualizando senha...');
            existingAdmin.password = hashedPassword;
            const updatedUser = await this.userRepository.save(existingAdmin);
            console.log('✅ Usuário admin atualizado com sucesso');
            return updatedUser;
        }
        console.log('👤 Criando novo usuário admin...');
        const adminUser = this.userRepository.create({
            email: 'admin@esalas.com',
            password: hashedPassword,
            username: 'admin',
            role: 'admin',
            isActive: true
        });
        const savedUser = await this.userRepository.save(adminUser);
        console.log('✅ Usuário admin criado com sucesso');
        return savedUser;
    }
    generateSecurePassword() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
        let password = '';
        for (let i = 0; i < 16; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return password;
    }
    async checkAdminUser() {
        const admin = await this.userRepository.findOne({
            where: { email: 'admin@esalas.com' }
        });
        if (!admin) {
            return { exists: false, message: 'Usuário admin não encontrado' };
        }
        return {
            exists: true,
            id: admin.id,
            email: admin.email,
            username: admin.username,
            role: admin.role,
            isActive: admin.isActive,
            createdAt: admin.createdAt,
            updatedAt: admin.updatedAt,
            passwordHash: admin.password.substring(0, 20) + '...'
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map