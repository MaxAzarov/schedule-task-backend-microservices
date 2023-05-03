import { IsEnum } from 'class-validator';
import { IntegrationType } from '../types';

export class MarkEventAsDoneDto {
  @IsEnum(IntegrationType)
  type: IntegrationType;
}
