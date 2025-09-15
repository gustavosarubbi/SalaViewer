import { IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateAndarDto {
  @IsNumber()
  numero_andar: number;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  nome_identificador?: string;
}

export class UpdateAndarDto {
  @IsOptional()
  @IsNumber()
  numero_andar?: number;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  nome_identificador?: string;
}
