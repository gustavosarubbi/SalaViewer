import { Andar } from './andar.entity';
export declare class Sala {
    id: number;
    numero_sala: string;
    nome_ocupante: string;
    andarId: number;
    andar: Andar;
    createdAt: Date;
    updatedAt: Date;
    get documentId(): string;
}
