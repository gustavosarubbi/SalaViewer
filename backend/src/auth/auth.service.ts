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

    if (existingAdmin) {
      // Atualizar senha do usuário existente
      const hashedPassword = await bcrypt.hash('admin123', 10);
      existingAdmin.password = hashedPassword;
      const updatedUser = await this.userRepository.save(existingAdmin);
      return updatedUser;
    }

    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const adminUser = this.userRepository.create({
      email: 'admin@esalas.com',
      password: hashedPassword,
      username: 'admin',
      role: 'admin',
      isActive: true
    });

    const savedUser = await this.userRepository.save(adminUser);
    
    return savedUser;
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
