import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterUserDto {
  @IsNotEmpty({
    message: 'The username cannot be empty',
  })
  @ApiProperty()
  username: string;

  @IsNotEmpty({
    message: 'Nicknames cannot be empty',
  })
  @ApiProperty()
  nickName: string;

  @IsNotEmpty({
    message: 'Password cannot be empty',
  })
  @MinLength(6, {
    message: 'Password cannot be less than 6 digits',
  })
  @ApiProperty({
    minLength: 6,
  })
  password: string;

  @IsNotEmpty({
    message: 'Mail cannot be empty',
  })
  @IsEmail(
    {},
    {
      message: 'Invalid mail',
    },
  )
  @ApiProperty()
  email: string;

  @IsNotEmpty({
    message: 'Captcha cannot be empty',
  })
  @ApiProperty()
  captcha: string;
}
