import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsEnum,
  IsString,
  IsEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { EventType } from '@app/common';

export class CreateIntegrationDto {
  @IsEnum(EventType)
  type: EventType;

  @ApiProperty({ example: 'accessToken' })
  @IsNotEmpty()
  accessToken: string | null;

  @ApiProperty({ example: 'refreshToken' })
  @IsNotEmpty()
  refreshToken: string | null;

  @IsString()
  @IsOptional()
  clientId: string;

  @IsNumber()
  @IsOptional()
  userId?: number;

  @IsEmpty()
  @IsString()
  @IsOptional()
  email?: string;
}
