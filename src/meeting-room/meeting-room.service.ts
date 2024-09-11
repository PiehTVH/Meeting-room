import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MeetingRoom } from './entities/meeting-room.entity';
import { Like, Repository } from 'typeorm';
import { CreateMeetingRoomDto } from './dto/create-meeting-room.dto';
import { UpdateMeetingRoomDto } from './dto/update-meeting-room.dto';

@Injectable()
export class MeetingRoomService {
  @InjectRepository(MeetingRoom)
  private repository: Repository<MeetingRoom>;

  async initData() {
    const room1 = new MeetingRoom();
    room1.name = 'Jupiter';
    room1.capacity = 10;
    room1.equipment = 'whiteboard';
    room1.location = 'Ground floor west';

    const room2 = new MeetingRoom();
    room2.name = 'Venus';
    room2.capacity = 5;
    room2.equipment = '';
    room2.location = 'East on the second floor';

    const room3 = new MeetingRoom();
    room3.name = 'Uranus';
    room3.capacity = 30;
    room3.equipment = 'Whiteboard, TV';
    room3.location = 'Three-storey east';

    await this.repository.insert([room1, room2, room3]);
  }

  async find(
    pageNo: number,
    pageSize: number,
    name: string,
    capacity: number,
    equipment: string,
  ) {
    if (pageNo < 1) {
      throw new BadRequestException('The minimum page number is 1');
    }
    const skipCount = (pageNo - 1) * pageSize;
    const condition: Record<string, any> = {};

    if (name) {
      condition.name = Like(`${name}`);
    }
    if (equipment) {
      condition.equipment = Like(`%${equipment}%`);
    }
    if (capacity) {
      condition.capacity = capacity;
    }
    const [meetingRooms, totalCount] = await this.repository.findAndCount({
      skip: skipCount,
      take: pageSize,
      where: condition,
    });
    return {
      meetingRooms,
      totalCount,
    };
  }

  async create(meetingRoomDto: CreateMeetingRoomDto) {
    const room = await this.repository.findOneBy({
      name: meetingRoomDto.name,
    });
    if (room) {
      throw new BadRequestException('Meeting room name already exists');
    }
    return await this.repository.save(meetingRoomDto);
  }

  async update(meetingRoomDto: UpdateMeetingRoomDto) {
    const meetingRoom = await this.repository.findOneBy({
      id: meetingRoomDto.id,
    });
    if (!meetingRoom) {
      throw new BadRequestException('Not exist');
    }

    meetingRoom.capacity = meetingRoomDto.capacity;
    meetingRoom.location = meetingRoomDto.location;
    meetingRoom.name = meetingRoomDto.name;

    if (meetingRoomDto.description) {
      meetingRoom.description = meetingRoomDto.description;
    }
    if (meetingRoomDto.equipment) {
      meetingRoom.equipment = meetingRoomDto.equipment;
    }

    await this.repository.update(
      {
        id: meetingRoom.id,
      },
      meetingRoom,
    );

    return 'The meeting room information was updated successfully';
  }

  async findById(id: number) {
    return this.repository.findOneBy({
      id,
    });
  }

  async delete(id: number) {
    await this.repository.delete({
      id,
    });
    return 'The meeting room was deleted';
  }
}
