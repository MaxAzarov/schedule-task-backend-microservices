import { firstValueFrom } from 'rxjs';
import {
  BadRequestException,
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy } from '@nestjs/microservices';
import { USERS_SERVICE, User } from '@app/common';
import { SignupDto } from './dto/auth-signup.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(USERS_SERVICE) private usersClient: ClientProxy,
    private readonly jwtService: JwtService,
  ) {}

  async me(userDto: User) {
    const user = await this.usersClient.send('find_user', { id: userDto.id });

    if (!user) {
      throw new BadRequestException({
        error: 'User does not exist',
      });
    }

    return await firstValueFrom(user);
  }

  async getUserFromToken(token: string) {
    return this.jwtService.decode(token);
  }

  async signIn(email: string, password: string): Promise<any> {
    const data = await this.usersClient.send('find_user', { email });

    const user = await firstValueFrom(data);

    if (!user) {
      throw new BadRequestException({
        error: 'User does not exist',
      });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (isValidPassword) {
      const payload = { email: user.email, id: user.id };
      const token = await this.jwtService.signAsync(payload);

      return { token, user: user };
    } else {
      throw new UnprocessableEntityException({
        error: 'Invalid user data',
      });
    }
  }

  async signUp(loginDto: SignupDto) {
    const user = await firstValueFrom(
      this.usersClient.emit('find_user', { email: loginDto.email }),
    );

    if (user) {
      throw new BadRequestException({
        error: 'User exists',
      });
    }

    return await firstValueFrom(this.usersClient.emit('create_user', loginDto));
  }
}
