import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEnum, IsString, IsEmpty } from 'class-validator';
import { IntegrationType } from '../types';

export class CreateIntegrationDto {
  @IsEnum(IntegrationType)
  type: IntegrationType;

  @ApiProperty({ example: 'accessToken' })
  @IsNotEmpty()
  accessToken: string | null;

  @ApiProperty({ example: 'refreshToken' })
  @IsNotEmpty()
  refreshToken: string | null;

  @IsNotEmpty()
  @IsString()
  userId: string;

  // @IsNotEmpty()
  @IsEmpty()
  @IsString()
  clientId: string;

  @IsEmpty()
  @IsString()
  email?: string;
}
