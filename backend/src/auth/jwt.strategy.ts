import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'fallback-secret-key',
    });
  }

  async validate(payload: any) {
    // Buscar usuário no banco para obter role real
    const userRepository = this.configService.get('userRepository');
    if (userRepository) {
      const user = await userRepository.findOne({ where: { id: payload.sub } });
      if (user) {
        return {
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.role
        };
      }
    }
    
    // Fallback para compatibilidade
    return { 
      id: payload.sub, 
      email: payload.email,
      username: payload.email.split('@')[0],
      role: 'admin'
    };
  }
}
