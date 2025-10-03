import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';
import { Sala } from './sala.entity';

@Entity('andares')
@Index(['numero_andar'], { unique: true })
export class Andar {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  numero_andar: number;

  @Column({ nullable: true, length: 100 })
  nome_identificador: string;

  @OneToMany(() => Sala, sala => sala.andar, { cascade: true })
  salas: Sala[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
