import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly entityManger: EntityManager) {}

  findOne(fields: Partial<Pick<User, 'id' | 'email'>>) {
    const userRepository = this.entityManger.getRepository(User);

    return userRepository.findOne({ where: fields });
  }

  create(createProfileDto: CreateUserDto) {
    const usersRepository = this.entityManger.getRepository(User);

    return usersRepository.save(usersRepository.create(createProfileDto));
  }
}
