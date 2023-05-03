import { IsEnum } from 'class-validator';
import { EventType } from '../types';

export class MarkEventAsDoneDto {
  @IsEnum(EventType)
  type: EventType;
}
