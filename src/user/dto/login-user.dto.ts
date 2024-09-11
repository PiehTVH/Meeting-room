import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class LoginUserDto {
  @IsNotEmpty({
    message: 'Username cannot be empty',
  })
  @ApiProperty()
  username: string;

  @IsNotEmpty({
    message: 'Password cannot be empty',
  })
  @ApiProperty()
  password: string;
}
