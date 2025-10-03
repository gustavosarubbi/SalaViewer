import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from '../entities/user.entity';
import { LoginDto } from '../entities/dto/user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
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

  async validateUser(email: string, password: string): Promise<User | null> {
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

    // Usar senha da variável de ambiente ou senha padrão para desenvolvimento
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    console.log('🔑 Senha do admin:', adminPassword);
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    if (existingAdmin) {
      // Atualizar senha do usuário existente
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

  private generateSecurePassword(): string {
    // Gerar senha segura com 16 caracteres
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
      passwordHash: admin.password.substring(0, 20) + '...' // Mostrar apenas parte do hash
    };
  }
}
