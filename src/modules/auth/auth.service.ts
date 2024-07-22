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
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly jwtService: JwtService
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersRepository.findOne({ where: { username } });
    if (user && (await bcrypt.compare(password, user.password))) {
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
      throw new ConflictException('Username already exists');
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);

    const newUser = this.usersRepository.create({
      ...body,
      password: hashedPassword
    });

    await this.usersRepository.save(newUser);

    const { password, ...result } = newUser;
    return newUser;
  }

  async login(body: registerDTO): Promise<any> {
    const { username, password } = body;

    const existUser = await this.usersRepository.findOne({
      where: { username },
      select: ['id', 'username', 'password']
    });

    if (!existUser) {
      throw new ConflictException('Username does not exist');
    }

    const passwordMatch = await bcrypt.compare(password, existUser.password);

    if (!passwordMatch) {
      throw new UnauthorizedException('Password is incorrect');
    }

    const payload = { username: existUser.username, sub: existUser.id };

    const access_token = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET
    });

    const refresh_token = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d'
    });

    const { password: _, ...result } = existUser;

    return { user: result, access_token, refresh_token };
  }
}
