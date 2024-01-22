import { Module, forwardRef } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { AUTH_SERVICE } from '@app/common';
import { IntegrationsController } from './integrations.controller';
import { IntegrationsService } from './integrations.service';
import { MessageGateway } from './message.gateway';
import { TrelloService } from '../trello/trello.service';
import { TrelloStrategy } from '../trello/strategy/trello-strategy';
import { JiraService } from '../jira/jira.service';
import { JiraStrategy } from '../jira/jira-strategy/jira-strategy';
import { EventsService } from '../events/events.service';
import { JiraModule } from '../jira/jira.module';
import { EventsModule } from '../events/events.module';
import { TrelloModule } from '../trello/trello.module';

@Module({
  controllers: [IntegrationsController],
  providers: [
    IntegrationsService,
    TrelloService,
    TrelloStrategy,
    JiraService,
    JiraStrategy,
    EventsService,
    MessageGateway,
  ],
  imports: [
    ClientsModule.registerAsync([
      {
        name: AUTH_SERVICE,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get('AUTH_HOST'),
            port: configService.get('AUTH_TCP_PORT'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
    HttpModule,
    JiraModule,
    EventsModule,
    forwardRef(() => TrelloModule),
  ],
})
export class IntegrationsModule {}
