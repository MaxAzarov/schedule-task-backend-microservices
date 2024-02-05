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
import { Request as IRequest } from 'express';
import { MessagePattern } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { AuthLoginDto } from './dto/auth-login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { SignupDto } from './dto/auth-signup.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() loginDto: AuthLoginDto) {
    return this.authService.signIn(loginDto.email, loginDto.password);
  }

  @HttpCode(HttpStatus.OK)
  @Post('signup')
  signUp(@Body() loginDto: SignupDto) {
    return this.authService.signUp(loginDto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  public async me(@Request() request: IRequest) {
    return this.authService.me((request as any).user);
  }

  @UseGuards(JwtAuthGuard)
  @MessagePattern('authenticate')
  async authenticate(@Request() request: IRequest) {
    return this.authService.me((request as any).user);
  }

  @MessagePattern('decode_user')
  async getUser(token: string) {
    return this.authService.getUserFromToken(token);
  }
}
