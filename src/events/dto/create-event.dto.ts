import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateEventDto {
  @IsString()
  title: string;

  @IsDate()
  @IsOptional()
  start?: Date;

  @IsDate()
  @IsOptional()
  end?: Date;

  @IsOptional()
  resource?: unknown;

  @IsNotEmpty()
  @IsString()
  userId: string;
}
