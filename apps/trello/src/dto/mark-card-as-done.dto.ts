import { IsString } from 'class-validator';

export class MarkCardAsDoneDto {
  @IsString()
  readyColumnId: string;

  @IsString()
  accessToken: string;

  @IsString()
  cardId: string;
}
