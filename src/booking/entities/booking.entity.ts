import { MeetingRoom } from 'src/meeting-room/entities/meeting-room.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    comment: 'startTime',
  })
  startTime: Date;

  @Column({
    comment: 'endTime',
  })
  endTime: Date;

  @Column({
    length: 20,
    comment: 'Status (Requesting, Approved, Rejected, Dismissed) ',
    default: 'Requesting',
  })
  status: string;

  @Column({
    length: 100,
    comment: 'note',
    default: '',
  })
  note: string;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => MeetingRoom)
  room: MeetingRoom;

  @CreateDateColumn({
    comment: 'createTime',
  })
  createTime: Date;

  @UpdateDateColumn({
    comment: 'updateTime',
  })
  updateTime: Date;
}
