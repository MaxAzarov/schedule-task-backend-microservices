import { IsString } from 'class-validator';

export class GetMyselfDto {
  @IsString()
  accessToken: string;

  @IsString()
  clientId: string;
}
