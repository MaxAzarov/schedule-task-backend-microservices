import { IsString } from 'class-validator';

export class MarkCardAsDoneDto {
  @IsString()
  userId: string;

  @IsString()
  cardId: string;

  @IsString()
  accessToken: string;

  @IsString()
  clientId: string;

  @IsString()
  readyColumnId: string;
}
