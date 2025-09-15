import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Andar } from './andar.entity';

@Entity('salas')
export class Sala {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 50 })
  numero_sala: string;

  @Column({ nullable: true, length: 200 })
  nome_ocupante: string;

  @Column()
  andarId: number;

  @ManyToOne(() => Andar, andar => andar.salas)
  @JoinColumn({ name: 'andarId' })
  andar: Andar;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Campo documentId para compatibilidade com o frontend
  get documentId(): string {
    return this.id.toString();
  }
}
