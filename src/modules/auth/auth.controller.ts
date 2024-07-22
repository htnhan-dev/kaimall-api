import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() body): Promise<string> {
    return this.authService.register(body);
  }

  @Post('login')
  async login(@Body() body): Promise<string> {
    return this.authService.login(body);
  }
}
