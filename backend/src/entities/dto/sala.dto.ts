import { IsString, IsOptional, IsNumber, MaxLength } from 'class-validator';

export class CreateSalaDto {
  @IsString()
  @MaxLength(50)
  numero_sala: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  nome_ocupante?: string;

  @IsNumber()
  andar: number;
}

export class UpdateSalaDto {
  @IsOptional()
  @IsString()
  @MaxLength(50)
  numero_sala?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  nome_ocupante?: string;

  @IsOptional()
  @IsNumber()
  andar?: number;
}
