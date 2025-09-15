import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Sala } from './sala.entity';

@Entity('andares')
export class Andar {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  numero_andar: number;

  @Column({ nullable: true, length: 100 })
  nome_identificador: string;

  @OneToMany(() => Sala, sala => sala.andar)
  salas: Sala[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Campo documentId para compatibilidade com o frontend
  get documentId(): string {
    return this.id.toString();
  }
}
