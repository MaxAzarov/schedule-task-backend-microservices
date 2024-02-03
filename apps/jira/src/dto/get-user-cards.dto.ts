import { IsString } from 'class-validator';

export class GetUserCardsDto {
  @IsString()
  accessToken: string;

  @IsString()
  clientId: string;

  @IsString()
  todoColumnId: string;

  @IsString()
  projectId: string;

  @IsString()
  email: string;
}
