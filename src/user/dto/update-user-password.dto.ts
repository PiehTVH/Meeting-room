import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserPasswordDto {
  @IsNotEmpty({
    message: 'Username cannot be empty',
  })
  @ApiProperty()
  username: string;

  @IsNotEmpty({
    message: 'Password cannot be empty',
  })
  @MinLength(6, {
    message: 'Password cannot be less than 6 digits',
  })
  @ApiProperty()
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
