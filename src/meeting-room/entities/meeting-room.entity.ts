import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class MeetingRoom {
  @PrimaryGeneratedColumn({
    comment: 'Room Id',
  })
  id: number;

  @Column({
    length: 50,
    comment: 'Name of the meeting room',
  })
  name: string;

  @Column({
    comment: 'Meeting room capacity',
  })
  capacity: number;

  @Column({
    length: 50,
    comment: 'Meeting room location',
  })
  location: string;

  @Column({
    length: 50,
    comment: 'Equipment',
    default: '',
  })
  equipment: string;

  @Column({
    length: 100,
    comment: 'Description',
    default: '',
  })
  description: string;

  @Column({
    comment: 'Is booked or not',
    default: false,
  })
  isBooked: boolean;

  @CreateDateColumn({
    comment: 'Creation time',
  })
  createTime: Date;

  @UpdateDateColumn({
    comment: 'Updated time',
  })
  updateTime: Date;
}
