import { IsString } from 'class-validator';

export class GetProjectStatusesDto {
  @IsString()
  projectId: string;

  @IsString()
  clientId: string;

  @IsString()
  accessToken: string;
}
