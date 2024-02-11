import { Module, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

import { HttpModule } from '@nestjs/axios';
import { LoggerModule, MessageGateway } from '@app/common';
import { TrelloController } from './trello.controller';
import { TrelloService } from './trello.service';
import { TrelloStrategy } from './strategy/trello-strategy';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        TRELLO_CLIENT_ID: Joi.string().required(),
        TRELLO_CLIENT_SECRET: Joi.string().required(),
        TRELLO_CLIENT_CALLBACK: Joi.string().required(),
        TRELLO_WEBHOOK_CALLBACK: Joi.string().required(),
      }),
    }),
    HttpModule,
  ],
  controllers: [TrelloController],
  providers: [TrelloService, TrelloStrategy, MessageGateway],
})
export class TrelloModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerModule).forRoutes('*');
  }
}
