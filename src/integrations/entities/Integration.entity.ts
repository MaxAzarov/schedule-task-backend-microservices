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

import { EntityHelper } from 'src/utils/database/entity-helper';
import { ApiProperty } from '@nestjs/swagger';
import { IntegrationType } from '../types';
import { User } from 'src/users/entities/user.entity';

@Entity()
@Unique(['type', 'userId'])
export class Integration extends EntityHelper {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: IntegrationType,
  })
  type: IntegrationType;

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

  /**
   * board id or project id
   */
  @Column({ nullable: true })
  projectId: string;

  /**
   * board id or project id
   */
  @Column({ nullable: true })
  todoColumnId: string;

  /**
   * board id or project id
   */
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
