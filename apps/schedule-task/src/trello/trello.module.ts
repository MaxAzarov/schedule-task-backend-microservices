import { HttpModule } from '@nestjs/axios';
import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AUTH_SERVICE, USERS_SERVICE } from '@app/common';
import { TrelloStrategy } from './strategy/trello-strategy';
import { TrelloController } from './trello.controller';
import { TrelloService } from './trello.service';
import { IntegrationsModule } from '../integrations/integrations.module';
import { EventsModule } from '../events/events.module';
import { IntegrationsService } from '../integrations/integrations.service';
import { JiraService } from '../jira/jira.service';
import { JiraStrategy } from '../jira/jira-strategy/jira-strategy';
import { EventsService } from '../events/events.service';
import { MessageGateway } from '../integrations/message.gateway';

@Module({
  imports: [
    HttpModule,
    JwtModule,
    forwardRef(() => IntegrationsModule),
    EventsModule,
    ClientsModule.register([
      {
        name: USERS_SERVICE,
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: 3002,
        },
      },
      {
        name: AUTH_SERVICE,
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: 3001,
        },
      },
    ]),
  ],
  controllers: [TrelloController],
  providers: [
    TrelloStrategy,

    IntegrationsService,
    TrelloService,
    JiraService,
    JiraStrategy,
    EventsService,
    MessageGateway,
  ],
})
export class TrelloModule {}
