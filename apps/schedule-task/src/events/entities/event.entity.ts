import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { EntityHelper } from '@app/common/database';
import { User } from '@app/common';

@Entity()
export class Event extends EntityHelper {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user)
  user: User;

  @Column()
  userId: string;

  @Column()
  title?: string;

  @Column({ type: 'timestamp' })
  start?: Date;

  @Column({ type: 'timestamp' })
  end?: Date;

  @Column({
    type: 'jsonb',
    nullable: true,
  })
  resource: unknown;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
