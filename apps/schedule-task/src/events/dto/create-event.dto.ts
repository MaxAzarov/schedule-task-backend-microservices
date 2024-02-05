import { Type } from 'class-transformer';
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateEventDto {
  @IsString()
  title: string;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  start?: Date;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  end?: Date;

  @IsOptional()
  resource?: unknown;

  @IsNumber()
  @IsOptional()
  userId: number;
}
