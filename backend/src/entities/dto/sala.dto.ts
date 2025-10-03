import { IsString, IsOptional, IsNumber, MaxLength, IsNotEmpty, Min, Max } from 'class-validator';

export class CreateSalaDto {
  @IsString({ message: 'Número da sala deve ser uma string' })
  @IsNotEmpty({ message: 'Número da sala não pode estar vazio' })
  @MaxLength(4, { message: 'Número da sala deve ter no máximo 4 caracteres' })
  numero_sala: string;

  @IsOptional()
  @IsString({ message: 'Nome do ocupante deve ser uma string' })
  @MaxLength(200, { message: 'Nome do ocupante deve ter no máximo 200 caracteres' })
  nome_ocupante?: string;

  @IsNumber({}, { message: 'ID do andar deve ser um número' })
  @Min(1, { message: 'ID do andar deve ser maior que 0' })
  andar: number;
}

export class UpdateSalaDto {
  @IsOptional()
  @IsString({ message: 'Número da sala deve ser uma string' })
  @MaxLength(4, { message: 'Número da sala deve ter no máximo 4 caracteres' })
  numero_sala?: string;

  @IsOptional()
  @IsString({ message: 'Nome do ocupante deve ser uma string' })
  @MaxLength(200, { message: 'Nome do ocupante deve ter no máximo 200 caracteres' })
  nome_ocupante?: string;

  @IsOptional()
  @IsNumber({}, { message: 'ID do andar deve ser um número' })
  @Min(1, { message: 'ID do andar deve ser maior que 0' })
  andar?: number;
}
