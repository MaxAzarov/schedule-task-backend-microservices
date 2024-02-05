import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { User } from '@app/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(@Param('id') id: number, @Body() createUserDto: CreateUserDto) {
    return this.usersService.update(id, createUserDto);
  }

  @EventPattern('find_user')
  async findUser(fields: Partial<Pick<User, 'id' | 'email'>>) {
    return this.usersService.findOne(fields);
  }

  @EventPattern('create_user')
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @EventPattern('find_all')
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }
}
