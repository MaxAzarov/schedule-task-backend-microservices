import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  MinLength,
  Validate,
  IsPhoneNumber,
} from 'class-validator';
import { IsNotExist } from '@app/common/database';

export class CreateUserDto {
  @ApiProperty({ example: 'volodor05412@example.com' })
  @Transform(({ value }) => value?.toLowerCase().trim())
  @IsNotEmpty()
  @Validate(IsNotExist, ['User'], {
    message: 'emailAlreadyExists',
  })
  @IsEmail()
  email: string;

  @ApiProperty()
  @MinLength(6)
  password?: string;

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
