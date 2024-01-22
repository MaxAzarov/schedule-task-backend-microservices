import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { DatabaseModule } from '@app/common/database/database.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        USERS_HTTP_PORT: Joi.number().required(),
        USERS_TCP_PORT: Joi.number().required(),
        USERS_HOST: Joi.string().required(),
      }),
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService, ConfigService],
})
export class UsersModule {}
