import { IsNumber, IsOptional, IsString, MaxLength, IsNotEmpty, Min, Max } from 'class-validator';

export class CreateAndarDto {
  @IsNumber({}, { message: 'Número do andar deve ser um número' })
  @Min(1, { message: 'Número do andar deve ser maior que 0' })
  @Max(1000, { message: 'Número do andar deve ser menor que 1000' })
  numero_andar: number;

  @IsOptional()
  @IsString({ message: 'Nome identificador deve ser uma string' })
  @MaxLength(100, { message: 'Nome identificador deve ter no máximo 100 caracteres' })
  nome_identificador?: string;
}

export class UpdateAndarDto {
  @IsOptional()
  @IsNumber({}, { message: 'Número do andar deve ser um número' })
  @Min(1, { message: 'Número do andar deve ser maior que 0' })
  @Max(1000, { message: 'Número do andar deve ser menor que 1000' })
  numero_andar?: number;

  @IsOptional()
  @IsString({ message: 'Nome identificador deve ser uma string' })
  @MaxLength(100, { message: 'Nome identificador deve ter no máximo 100 caracteres' })
  nome_identificador?: string;
}
