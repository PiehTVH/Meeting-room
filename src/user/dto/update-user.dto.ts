import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty()
  headPic: string;

  @ApiProperty()
  nickName: string;

  @IsNotEmpty({
    message: 'Email cannot be empty',
  })
  @IsEmail(
    {},
    {
      message: 'Invalid email format',
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
