import { IsString } from 'class-validator';

export class MarkCardAsDoneDto {
  @IsString()
  userId: number;

  @IsString()
  cardId: string;

  @IsString()
  accessToken: string;

  @IsString()
  clientId: string;

  @IsString()
  readyColumnId: string;
}
