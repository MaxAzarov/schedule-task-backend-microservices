import { IsEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateIntegrationDto {
  @IsEmpty()
  @IsString()
  projectId: string;

  @IsEmpty()
  @IsString()
  todoColumnId: string;

  @IsEmpty()
  @IsString()
  readyColumnId: string;

  @IsOptional()
  @IsString()
  refreshToken: string;

  @IsOptional()
  @IsString()
  accessToken: string;
}
