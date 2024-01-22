import { IsEnum } from 'class-validator';
import { EventType } from '@app/common';

export class MarkEventAsDoneDto {
  @IsEnum(EventType)
  type: EventType;
}
