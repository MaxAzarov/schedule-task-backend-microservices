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
import {
  AuthSignInResponse,
  JwtPayload,
} from './types/auth.types';

@Injectable()
export class AuthService {
  constructor(
    @Inject(USERS_SERVICE) private usersClient: ClientProxy,
    private readonly jwtService: JwtService,
  ) {}

  async me(payload: JwtPayload): Promise<User> {
    const result = await firstValueFrom(
      this.usersClient.send('find_user', { id: payload.id }) as unknown as Parameters<
        typeof firstValueFrom
      >[0],
    );
    const found = result as User | undefined;

    if (!found) {
      throw new BadRequestException({
        error: 'User does not exist',
      });
    }

    return found;
  }

  getUserFromToken(token: string): JwtPayload | string | null {
    return this.jwtService.decode(token) as JwtPayload | string | null;
  }

  async signIn(email: string, password: string): Promise<AuthSignInResponse> {
    const result = await firstValueFrom(
      this.usersClient.send('find_user', { email }) as unknown as Parameters<
        typeof firstValueFrom
      >[0],
    );
    const user = result as User | undefined;

    if (!user) {
      throw new BadRequestException({
        error: 'User does not exist',
      });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      throw new UnprocessableEntityException({
        error: 'Invalid user data',
      });
    }

    const token = await this.jwtService.signAsync({
      email: user.email,
      id: user.id,
    });

    const { password: _password, ...rest } = user as User;

    const userWithoutPassword: AuthSignInResponse['user'] = {
      id: rest.id,
      email: rest.email,
      firstName: rest.firstName,
      lastName: rest.lastName,
      phone: rest.phone,
      createdAt: rest.createdAt,
      updatedAt: rest.updatedAt,
    };

    return { token, user: userWithoutPassword };
  }

  async signUp(loginDto: SignupDto): Promise<User> {
    const result = await firstValueFrom(
      this.usersClient.send('find_user', {
        email: loginDto.email,
      }) as unknown as Parameters<typeof firstValueFrom>[0],
    );

    const user = result as User | undefined;

    if (user) {
      throw new BadRequestException({
        error: 'User exists',
      });
    }

    const created = await firstValueFrom(
      this.usersClient.send('create_user', loginDto) as unknown as Parameters<
        typeof firstValueFrom
      >[0],
    );

    return created as User;
  }
}
