import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Like, Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { Permission } from './entities/permission.entity';
import { md5 } from 'src/utils';
import { RegisterUserDto } from './dto/register-user.dto';
import { RedisService } from 'src/redis/redis.service';
import { LoginUserDto } from './dto/login-user.dto';
import { LoginUserVo } from './vo/login-user.vo';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserListVo } from './vo/user-list.vo';

@Injectable()
export class UserService {
  private logger = new Logger();

  @InjectRepository(User)
  private userRepository: Repository<User>;

  @InjectRepository(Role)
  private roleRepository: Repository<Role>;

  @InjectRepository(Permission)
  private permissionRepository: Repository<Permission>;

  @Inject(RedisService)
  private redisService: RedisService;

  async initData() {
    const user1 = new User();
    user1.username = 'hiep';
    user1.password = md5('111111');
    user1.email = 'xxx@xx.com';
    user1.isAdmin = true;
    user1.nickName = 'Pieh';
    user1.phoneNumber = '0468965452';

    const user2 = new User();
    user2.username = 'linh';
    user2.password = md5('222222');
    user2.email = 'yy@yy.com';
    user2.nickName = 'lindst';

    const role1 = new Role();
    role1.name = 'administrator';

    const role2 = new Role();
    role2.name = 'users';

    const permission1 = new Permission();
    permission1.code = 'ccc';
    permission1.description = 'Access the CCC interface';

    const permission2 = new Permission();
    permission2.code = 'ddd';
    permission2.description = 'Access the DDD interface';

    user1.roles = [role1];
    user2.roles = [role2];

    role1.permissions = [permission1, permission2];
    role2.permissions = [permission1];

    await this.permissionRepository.save([permission1, permission2]);
    await this.roleRepository.save([role1, role2]);
    await this.userRepository.save([user1, user2]);
  }

  async register(user: RegisterUserDto) {
    const captcha = await this.redisService.get(`captcha_${user.email}`);
    if (!captcha) {
      throw new HttpException('Captcha has expired', HttpStatus.BAD_REQUEST);
    }
    if (user.captcha !== captcha) {
      throw new HttpException('Captcha is incorrect', HttpStatus.BAD_REQUEST);
    }

    const foundUser = await this.userRepository.findOneBy({
      username: user.username,
    });
    if (foundUser) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    const newUser = new User();
    newUser.username = user.username;
    newUser.password = md5(user.password);
    newUser.email = user.email;
    newUser.nickName = user.nickName;

    try {
      await this.userRepository.save(newUser);
      return 'Registered successfully';
    } catch (e) {
      this.logger.error(e, UserService);
      return 'Registered failed';
    }
  }

  async login(loginUser: LoginUserDto, isAdmin: boolean) {
    const user = await this.userRepository.findOne({
      where: {
        username: loginUser.username,
        isAdmin,
      },
      relations: ['roles', 'roles.permissions'],
    });
    // console.log(
    //     '🚀 ~ file: user.service.ts:73 ~ UserService ~ login ~ user:',
    //     user,
    // );
    if (!user) {
      throw new HttpException('User does not exist', HttpStatus.BAD_REQUEST);
    }
    if (user.password !== md5(loginUser.password)) {
      throw new HttpException('Wrong password', HttpStatus.BAD_REQUEST);
    }
    const vo = new LoginUserVo();
    vo.userInfo = {
      id: user.id,
      username: user.username,
      nickName: user.nickName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      headPic: user.headPic,
      createTime: user.createTime.getTime(),
      isFrozen: user.isFrozen,
      isAdmin: user.isAdmin,
      roles: user.roles.map((item) => item.name),
      permissions: user.roles.reduce((arr, item) => {
        item.permissions.forEach((permission) => {
          if (arr.indexOf(permission) === -1) {
            arr.push(permission);
          }
        });
        return arr;
      }, []),
    };
    return vo;
  }

  async findUserById(userId: number, isAdmin: boolean) {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
        isAdmin,
      },
      relations: ['roles', 'roles.permissions'],
    });

    return {
      id: user.id,
      username: user.username,
      isAdmin: user.isAdmin,
      roles: user.roles.map((item) => item.name),
      permissions: user.roles.reduce((arr, item) => {
        item.permissions.forEach((permission) => {
          if (arr.indexOf(permission) === -1) {
            arr.push(permission);
          }
        });
        return arr;
      }, []),
      email: user.email,
    };
  }

  async findUserDetailById(userId: number) {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });
    return user;
  }

  async updatePassword(passwordDto: UpdateUserPasswordDto) {
    const captcha = await this.redisService.get(
      `update_password_captcha_${passwordDto.email}`,
    );
    if (!captcha) {
      throw new HttpException('Captcha expired', HttpStatus.BAD_REQUEST);
    }
    if (passwordDto.captcha !== captcha) {
      throw new HttpException('Captcha is incorrect', HttpStatus.BAD_REQUEST);
    }
    const foundUser = await this.userRepository.findOneBy({
      username: passwordDto.username,
    });
    if (foundUser.email !== passwordDto.email) {
      throw new HttpException('Invalid email ', HttpStatus.BAD_REQUEST);
    }
    foundUser.password = md5(passwordDto.password);
    try {
      await this.userRepository.save(foundUser);
      return 'Changed password successfully';
    } catch (e) {
      this.logger.error(e, UserService);
      return 'Failed to change password';
    }
  }

  async update(userId: number, updateUserDto: UpdateUserDto) {
    const captcha = await this.redisService.get(
      `update_user_captcha_${updateUserDto.email}`,
    );
    if (!captcha) {
      throw new HttpException('Captcha expired', HttpStatus.BAD_REQUEST);
    }

    if (updateUserDto.captcha !== captcha) {
      throw new HttpException('Captcha is incorrect', HttpStatus.BAD_REQUEST);
    }

    const foundUser = await this.userRepository.findOneBy({
      id: userId,
    });

    if (updateUserDto.nickName) {
      foundUser.nickName = updateUserDto.nickName;
    }
    if (updateUserDto.headPic) {
      foundUser.headPic = updateUserDto.headPic;
    }
    try {
      await this.userRepository.save(foundUser);
      return 'Modified successfully';
    } catch (e) {
      this.logger.error(e, UserService);
      return 'Failed to modify user information';
    }
  }

  async freezeUserById(userId: number) {
    const freezeUser = await this.userRepository.findOneBy({
      id: userId,
    });
    freezeUser.isFrozen = true;
    await this.userRepository.save(freezeUser);
  }

  async findUsers(
    username: string,
    nickName: string,
    email: string,
    pageNo: number,
    pageSize: number,
  ) {
    // TODO: Greater than 0
    const skipCount = (pageNo - 1) * pageSize;
    const condition: Record<string, any> = {};
    if (username) {
      condition.username = Like(`%${username}%`);
    }
    if (nickName) {
      condition.nickName = Like(`%${nickName}%`);
    }
    if (email) {
      condition.email = Like(`%${email}%`);
    }
    const [users, totalCount] = await this.userRepository.findAndCount({
      select: [
        'id',
        'username',
        'nickName',
        'email',
        'phoneNumber',
        'isFrozen',
        'headPic',
        'createTime',
      ],
      skip: skipCount,
      take: pageSize,
      where: condition,
    });
    const vo = new UserListVo();
    vo.users = users;
    vo.totalCount = totalCount;
    return vo;
  }
}
