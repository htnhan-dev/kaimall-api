import { IsString } from 'class-validator';

export class registerDTO {
  @IsString()
  username: string;

  @IsString()
  password: string;
}
