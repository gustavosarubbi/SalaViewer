import { IsEmail, IsString, MinLength, Matches, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: 'Email deve ter um formato válido' })
  email: string;

  @IsString({ message: 'Senha deve ser uma string' })
  @MinLength(8, { message: 'Senha deve ter pelo menos 8 caracteres' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    { message: 'Senha deve conter pelo menos: 1 letra minúscula, 1 maiúscula, 1 número e 1 caractere especial' }
  )
  password: string;

  @IsString({ message: 'Username deve ser uma string' })
  @IsNotEmpty({ message: 'Username não pode estar vazio' })
  @MinLength(3, { message: 'Username deve ter pelo menos 3 caracteres' })
  @MaxLength(50, { message: 'Username deve ter no máximo 50 caracteres' })
  username: string;
}

export class LoginDto {
  @IsEmail({}, { message: 'Email deve ter um formato válido' })
  email: string;

  @IsString({ message: 'Senha deve ser uma string' })
  @IsNotEmpty({ message: 'Senha não pode estar vazia' })
  password: string;
}
