import {
  ConflictException,
  Injectable,
  UnauthorizedException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersRepository.findOne({ where: { username } });
    if (user && user.password === password) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async register(user: any): Promise<any> {
    const existUser = await this.usersRepository.findOne({
      where: { username: user.username }
    });

    if (existUser) {
      throw new ConflictException('Email already exists');
    }

    const newUser = await this.usersRepository.save(user);
    const { password, ...result } = newUser;
    return result;
  }

  async login(user: any): Promise<any> {
    const existUser = await this.usersRepository.findOne({
      where: { username: user.username }
    });

    if (!existUser) {
      throw new ConflictException('Email does not exist');
    }

    if (existUser.password !== user.password) {
      throw new ConflictException('Password is incorrect');
    }

    const { password, ...result } = existUser;
    return result;
  }
}
