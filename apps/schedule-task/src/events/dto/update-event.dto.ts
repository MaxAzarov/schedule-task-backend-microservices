import { IsDate, IsOptional } from 'class-validator';

export class UpdateEventDto {
  @IsDate()
  @IsOptional()
  start?: Date;

  @IsDate()
  @IsOptional()
  end: Date;

  @IsOptional()
  resource: unknown;
}
