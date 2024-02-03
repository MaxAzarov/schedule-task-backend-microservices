import { IsString } from 'class-validator';

export class GetUserCardsDto {
  @IsString()
  todoColumnId: string;

  @IsString()
  accessToken: string;

  @IsString()
  clientId: string;
}
