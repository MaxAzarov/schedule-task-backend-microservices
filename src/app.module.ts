import { TypeOrmConfigService } from './database/typeorm-config.service';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerMiddleware } from './logger/logger';
import { TrelloModule } from './trello/trello.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JiraModule } from './jira/jira.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ClsModule } from 'nestjs-cls';
import { IntegrationsModule } from './integrations/integrations.module';
import { EventsModule } from './events/events.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
    TrelloModule,
    JiraModule,
    AuthModule,
    UsersModule,
    ClsModule.forRoot({
      global: true,
      middleware: { mount: true },
    }),
    IntegrationsModule,
    EventsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
