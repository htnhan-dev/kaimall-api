import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { registerDTO } from './auth.dto';
import { User } from '../users/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() body: registerDTO): Promise<User> {
    return this.authService.register(body);
  }

  @Post('login')
  async login(@Body() body: registerDTO): Promise<User> {
    return this.authService.login(body);
  }
}
