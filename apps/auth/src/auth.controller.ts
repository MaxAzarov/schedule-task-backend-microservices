import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Get,
  UseGuards,
  Request,
} from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { AuthLoginDto } from './dto/auth-login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { SignupDto } from './dto/auth-signup.dto';
import { RequestWithUser } from './types/auth.types';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() loginDto: AuthLoginDto) {
    return this.authService.signIn(
      loginDto.email,
      loginDto.password ?? '',
    );
  }

  @HttpCode(HttpStatus.OK)
  @Post('signup')
  signUp(@Body() loginDto: SignupDto) {
    return this.authService.signUp(loginDto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  me(@Request() request: RequestWithUser) {
    return this.authService.me(request.user);
  }

  @UseGuards(JwtAuthGuard)
  @MessagePattern('authenticate')
  authenticate(@Request() request: RequestWithUser) {
    return this.authService.me(request.user);
  }

  @MessagePattern('decode_user')
  getUser(token: string) {
    return this.authService.getUserFromToken(token);
  }
}
