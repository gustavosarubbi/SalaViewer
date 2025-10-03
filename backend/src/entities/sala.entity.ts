import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';
import { Andar } from './andar.entity';

@Entity('salas')
@Index(['numero_sala'], { unique: true })
@Index(['andarId'])
@Index(['nome_ocupante'])
export class Sala {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 50 })
  numero_sala: string;

  @Column({ nullable: true, length: 200 })
  nome_ocupante: string;

  @Column()
  andarId: number;

  @ManyToOne(() => Andar, andar => andar.salas, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'andarId' })
  andar: Andar;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
