import { Module, forwardRef } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { AUTH_SERVICE, USERS_SERVICE } from '@app/common';
import { JiraStrategy } from './jira-strategy/jira-strategy';
import { JiraController } from './jira.controller';
import { JiraService } from './jira.service';
import { IntegrationsModule } from '../integrations/integrations.module';
import { TrelloModule } from '../trello/trello.module';
import { EventsModule } from '../events/events.module';
import { IntegrationsService } from '../integrations/integrations.service';
import { TrelloStrategy } from '../trello/strategy/trello-strategy';
import { TrelloService } from '../trello/trello.service';
import { EventsService } from '../events/events.service';
import { MessageGateway } from '../integrations/message.gateway';

@Module({
  imports: [
    HttpModule,
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
      {
        name: USERS_SERVICE,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get('USERS_HOST'),
            port: configService.get('USERS_TCP_PORT'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
    JwtModule,
    forwardRef(() => IntegrationsModule),
    forwardRef(() => TrelloModule),
    EventsModule,
  ],
  controllers: [JiraController],
  providers: [
    JiraService,
    JiraStrategy,
    IntegrationsService,
    TrelloStrategy,
    IntegrationsService,
    TrelloService,
    JiraService,
    JiraStrategy,
    EventsService,
    MessageGateway,
  ],
})
export class JiraModule {}
