import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  MinLength,
  IsPhoneNumber,
} from 'class-validator';

export class UpdateUserDto {
  @ApiProperty()
  @MinLength(6)
  password?: string;

  @ApiProperty()
  @MinLength(6)
  oldPassword?: string;

  @ApiProperty({ example: 'John' })
  @IsNotEmpty()
  firstName?: string | null;

  @ApiProperty({ example: 'Doe' })
  @IsNotEmpty()
  lastName?: string | null;

  @ApiProperty({ example: '+14842634655' })
  @IsPhoneNumber()
  @IsOptional()
  phone?: string | null;
}
