import { IsString } from 'class-validator';

export class GetBoardsDto {
  @IsString()
  clientId: string;

  @IsString()
  accessToken: string;
}
