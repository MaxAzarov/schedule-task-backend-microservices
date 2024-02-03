import { IsString } from 'class-validator';

export class GetBoardListDto {
  @IsString()
  accessToken: string;

  @IsString()
  projectId: string;
}
