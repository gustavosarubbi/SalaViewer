import { Sala } from './sala.entity';
export declare class Andar {
    id: number;
    numero_andar: number;
    nome_identificador: string;
    salas: Sala[];
    createdAt: Date;
    updatedAt: Date;
}
