import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '@app/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly entityManger: EntityManager) {}

  findOne(fields: Partial<Pick<User, 'id' | 'email'>>) {
    const userRepository = this.entityManger.getRepository(User);

    return userRepository.findOne({ where: fields });
  }

  findAll() {
    const userRepository = this.entityManger.getRepository(User);

    return userRepository.find({});
  }

  create(createProfileDto: CreateUserDto) {
    const usersRepository = this.entityManger.getRepository(User);

    return usersRepository.save(usersRepository.create(createProfileDto));
  }

  async update(id: number, updateProfileDto: UpdateUserDto) {
    const usersRepository = this.entityManger.getRepository(User);

    if (updateProfileDto.password) {
      if (updateProfileDto.oldPassword) {
        const currentUser = await this.findOne({ id });

        const isValidOldPassword = await bcrypt.compare(
          updateProfileDto.oldPassword,
          currentUser.password,
        );

        if (!isValidOldPassword) {
          throw new HttpException(
            {
              status: HttpStatus.UNPROCESSABLE_ENTITY,
              errors: {
                oldPassword: 'incorrectOldPassword',
              },
            },
            HttpStatus.UNPROCESSABLE_ENTITY,
          );
        }
      } else {
        throw new HttpException(
          {
            status: HttpStatus.UNPROCESSABLE_ENTITY,
            errors: {
              oldPassword: 'missingOldPassword',
            },
          },
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
    }

    return usersRepository.save(
      usersRepository.create({
        id,
        ...updateProfileDto,
      }),
    );
  }
}
