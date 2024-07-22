import {
  ConflictException,
  Injectable,
  UnauthorizedException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { Repository } from 'typeorm';
import { registerDTO } from './auth.dto';
import * as bcrypt from 'bcrypt';

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

  async register(body: registerDTO): Promise<User> {
    const existUser = await this.usersRepository.findOne({
      where: { username: body.username }
    });

    if (existUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);

    const newUser = await this.usersRepository.save({
      ...body,
      password: hashedPassword
    });

    delete newUser.password;

    return newUser;
  }

  async login(body: registerDTO): Promise<any> {
    const { username, password } = body;

    const existUser = await this.usersRepository.findOne({
      where: { username },
      select: ['id', 'username', 'password']
    });

    if (!existUser) {
      throw new ConflictException('Email does not exist');
    }

    const passwordMatch = await bcrypt.compare(password, existUser.password);

    if (!passwordMatch) {
      throw new UnauthorizedException('Password is incorrect');
    }

    const { password: _, ...result } = existUser;

    return result;
  }
}
