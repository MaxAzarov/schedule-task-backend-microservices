import { ConfigModule } from '@nestjs/config';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { DatabaseModule, LoggerModule } from '@app/common';
import { TrelloModule } from './trello/trello.module';
import { JiraModule } from './jira/jira.module';
import { IntegrationsModule } from './integrations/integrations.module';
import { EventsModule } from './events/events.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    TrelloModule,
    JiraModule,
    IntegrationsModule,
    EventsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerModule).forRoutes('*');
  }
}
