import { Module, MiddlewareConsumer } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { LoggerModule } from '@app/common';
import { JiraStrategy } from './jira-strategy/jira-strategy';
import { JiraController } from './jira.controller';
import { JiraService } from './jira.service';

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        JIRA_CLIENT_KEY: Joi.string().required(),
        JIRA_API_TOKEN: Joi.string().required(),
        JIRA_CLIENT_SECRET: Joi.string().required(),
        JIRA_CLIENT_CALLBACK: Joi.string().required(),
        JIRA_WEBHOOK_CALLBACK: Joi.string().required(),
        JIRA_HOST: Joi.string().required(),
        JIRA_TCP_PORT: Joi.number().required(),
        JIRA_HTTP_PORT: Joi.number().required(),
      }),
    }),
  ],
  controllers: [JiraController],
  providers: [JiraService, JiraStrategy, JiraService, JiraStrategy],
})
export class JiraModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerModule).forRoutes('*');
  }
}
