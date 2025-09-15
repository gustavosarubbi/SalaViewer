import { AuthService } from './auth.service';
import { LoginDto } from '../entities/dto/user.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto): Promise<{
        jwt: string;
        user: {
            id: number;
            email: string;
            username: string;
            role: string;
        };
    }>;
    getProfile(req: any): any;
    checkAdmin(): Promise<{
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
