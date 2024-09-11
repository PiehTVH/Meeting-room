import { IsNotEmpty, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMeetingRoomDto {
  @ApiProperty()
  @IsNotEmpty({
    message: 'Room name cannot be empty',
  })
  @MaxLength(15, {
    message: 'Room name is up to 15 characters',
  })
  name: string;

  @ApiProperty()
  @IsNotEmpty({
    message: 'Capacity cannot be empty',
  })
  capacity: number;

  @ApiProperty()
  @IsNotEmpty({
    message: 'Position cannot be empty',
  })
  @MaxLength(50, {
    message: 'The maximum length of position is 50 characters',
  })
  location: string;

  @ApiProperty()
  @IsNotEmpty({
    message: 'Equipment cannot be empty',
  })
  @MaxLength(50, {
    message: 'The device has a maximum of 50 characters',
  })
  equipment: string;

  @ApiProperty()
  @IsNotEmpty({
    message: 'Description cannot be empty',
  })
  @MaxLength(100, {
    message: 'Descriptions are up to 100 characters long',
  })
  description: string;
}
