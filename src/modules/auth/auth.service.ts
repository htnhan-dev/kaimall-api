import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { Not, Repository } from 'typeorm';
import { refreshTokenDTO, registerDTO } from './auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { TokenUtils } from 'src/shared/utils/generate-token.util';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly tokenUtils: TokenUtils
  ) {}

  // ------------------ VALIDATE USER ------------------
  async validateUser(username: string, password: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { username },
      select: ['id', 'username', 'password', 'refresh_token']
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result as User;
    }
    return null;
  }

  // ------------------ REGISTER ------------------
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
    return result as User;
  }

  // ------------------ LOGIN ----------------
  async login(body: registerDTO): Promise<any> {
    const { username, password } = body;

    const validatedUser = await this.validateUser(username, password);

    if (!validatedUser) {
      throw new UnauthorizedException('Username or password is incorrect');
    }

    const tokens = this.tokenUtils.generateTokens(validatedUser);

    const { access_token, refresh_token } = tokens;

    await this.usersRepository.update(validatedUser.id, {
      refresh_token
    });

    return { user: validatedUser, access_token, refresh_token };
  }

  // ------------------ REFRESH TOKEN ------------------
  async refreshToken(body: refreshTokenDTO): Promise<any> {
    const { username, refresh_token } = body;

    const user = await this.usersRepository.findOne({
      where: { username, refresh_token }
    });

    if (!user) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const tokens = this.tokenUtils.generateTokens(user);

    const { access_token, refresh_token: new_refresh_token } = tokens;

    await this.usersRepository.update(user.id, {
      refresh_token: new_refresh_token
    });

    return { user, access_token, refresh_token: new_refresh_token };
  }

  // ------------------ LOGOUT ------------------
  async logout(body: refreshTokenDTO): Promise<any> {
    // TODO: Implement logout
  }

  // ------------------ FORGOT PASSWORD ------------------
  async forgotPassword(body: any): Promise<any> {}
}
