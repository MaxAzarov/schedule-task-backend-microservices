import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEnum, IsString, IsEmpty } from 'class-validator';
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
