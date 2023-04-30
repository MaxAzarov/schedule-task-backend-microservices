import { IsEmpty, IsString } from 'class-validator';

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
}
