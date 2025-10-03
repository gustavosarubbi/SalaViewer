import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from '../entities/user.entity';
import { LoginDto } from '../entities/dto/user.dto';
export declare class AuthService {
    private userRepository;
    private jwtService;
    constructor(userRepository: Repository<User>, jwtService: JwtService);
    login(loginDto: LoginDto): Promise<{
        jwt: string;
        user: {
            id: number;
            email: string;
            username: string;
            role: string;
        };
    }>;
    validateUser(email: string, password: string): Promise<User | null>;
    createAdminUser(): Promise<User>;
    private generateSecurePassword;
    checkAdminUser(): Promise<{
        exists: boolean;
        message: string;
        id?: undefined;
        email?: undefined;
        username?: undefined;
        role?: undefined;
        isActive?: undefined;
        createdAt?: undefined;
        updatedAt?: undefined;
        passwordHash?: undefined;
    } | {
        exists: boolean;
        id: number;
        email: string;
        username: string;
        role: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        passwordHash: string;
        message?: undefined;
    }>;
}
