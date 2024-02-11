import { IsOptional, IsString } from 'class-validator';

export class UpdateIntegrationDto {
  @IsString()
  @IsOptional()
  projectId: string;

  @IsString()
  @IsOptional()
  todoColumnId: string;

  @IsString()
  @IsOptional()
  readyColumnId: string;

  @IsOptional()
  @IsString()
  refreshToken: string;

  @IsOptional()
  @IsString()
  accessToken: string;
}
