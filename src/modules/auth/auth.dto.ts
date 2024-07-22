import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class registerDTO {
  @IsString()
  @ApiProperty({
    example: 'htnhan.dev'
  })
  username: string;

  @IsString()
  @ApiProperty({
    example: '123456'
  })
  password: string;
}

export class refreshTokenDTO {
  @IsString()
  @ApiProperty({
    example: 'htnhan.dev'
  })
  username: string;

  @IsString()
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImthaSIsInN1YiI6MSwiaWF0IjoxNzIxNjU3ODIxLCJleHAiOjE3MjIyNjI2MjF9.0I07CRDW54vvauGYjFboBV8aXHgrA-nIAPAzIEt1NY4'
  })
  refresh_token: string;
}
