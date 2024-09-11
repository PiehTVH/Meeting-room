import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from './role.entity';

@Entity({
  name: 'users',
})
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 50,
    comment: 'Username',
    unique: true,
  })
  username: string;

  @Column({
    length: 50,
    comment: 'password',
  })
  password: string;

  @Column({
    name: 'nick_name',
    length: 50,
    comment: 'nickName',
  })
  nickName: string;

  @Column({
    comment: 'email',
    length: 50,
  })
  email: string;

  @Column({
    comment: 'headPic',
    length: 100,
    nullable: true,
  })
  headPic: string;

  @Column({
    comment: 'phoneNumber',
    length: 20,
    nullable: true,
  })
  phoneNumber: string;

  @Column({
    comment: 'isFrozen',
    default: false,
  })
  isFrozen: boolean;

  @Column({
    comment: 'isAdmin',
    default: false,
  })
  isAdmin: boolean;

  @CreateDateColumn()
  createTime: Date;

  @UpdateDateColumn()
  updateTime: Date;

  @ManyToMany(() => Role)
  @JoinTable({
    name: 'user_roles',
  })
  roles: Role[];
}
