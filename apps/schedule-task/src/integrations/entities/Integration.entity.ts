import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';
import { EventType, User } from '@app/common';
import { EntityHelper } from '@app/common/database';

@Entity()
@Unique(['type', 'userId'])
export class Integration extends EntityHelper {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: EventType,
  })
  type: EventType;

  @ManyToOne(() => User, (user) => user)
  user: User;

  @Column()
  userId: string;

  @Column({ nullable: false })
  accessToken: string;

  @Column({ nullable: false })
  refreshToken: string;

  @Column({ nullable: false })
  clientId: string;

  @Column({ nullable: true })
  projectId: string;

  @Column({ nullable: true })
  todoColumnId: string;

  @Column({ nullable: true })
  readyColumnId: string;

  @Column({ nullable: true })
  email: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
