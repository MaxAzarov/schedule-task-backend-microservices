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

@Injectable()
export class AuthService {
  constructor(
    @Inject(USERS_SERVICE) private usersClient: ClientProxy,
    private readonly jwtService: JwtService,
  ) {}

  async me(user: User) {
    return await firstValueFrom(
      this.usersClient.emit('find_user', { id: user.id }),
    );
  }

  async getUserFromToken(token: string) {
    return this.jwtService.decode(token);
  }

  async signIn(email: string, password: string): Promise<any> {
    const user = await firstValueFrom(
      this.usersClient.emit('find_user', { email }),
    );

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
}
