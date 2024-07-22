import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { refreshTokenDTO, registerDTO } from './auth.dto';
import { User } from '../users/user.entity';
import { ApiTags } from '@nestjs/swagger';
import { ApiEndpoint } from 'src/common/decorators/api.decorator';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // ------------------ REGISTER ------------------
  @Post('register')
  @ApiEndpoint({
    title: 'Register',
    success: 'User registered successfully',
    body: registerDTO
  })
  async register(@Body() body: registerDTO): Promise<User> {
    return this.authService.register(body);
  }

  // ------------------ LOGIN ------------------
  @Post('login')
  @ApiEndpoint({
    title: 'User registration',
    success: 'User created successfully',
    body: registerDTO
  })
  async login(@Body() body: registerDTO): Promise<User> {
    return this.authService.login(body);
  }

  // ------------------ REFRESH TOKEN ------------------
  @Post('refresh-token')
  @ApiEndpoint({
    title: 'Refresh token',
    success: 'Token refreshed successfully',
    body: registerDTO
  })
  async refreshToken(@Body() body: refreshTokenDTO): Promise<any> {
    return this.authService.refreshToken(body);
  }

  // ------------------ LOGOUT ------------------
  @Post('logout')
  @ApiEndpoint({
    title: 'Logout',
    success: 'Logged out successfully',
    body: registerDTO
  })
  async logout(@Body() body: any): Promise<any> {
    return this.authService.logout(body);
  }
}
