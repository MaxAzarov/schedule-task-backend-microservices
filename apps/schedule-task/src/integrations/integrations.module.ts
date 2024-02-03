import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { AUTH_SERVICE, JIRA_SERVICE, TRELLO_SERVICE } from '@app/common';
import { IntegrationsController } from './integrations.controller';
import { IntegrationsService } from './integrations.service';
import { MessageGateway } from './message.gateway';
import { EventsModule } from '../events/events.module';
import { EventsService } from '../events/events.service';

@Module({
  controllers: [IntegrationsController],
  providers: [IntegrationsService, MessageGateway, EventsService],
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
      {
        name: TRELLO_SERVICE,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get('TRELLO_HOST'),
            port: configService.get('TRELLO_TCP_PORT'),
          },
        }),
        inject: [ConfigService],
      },
      {
        name: JIRA_SERVICE,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get('JIRA_HOST'),
            port: configService.get('JIRA_TCP_PORT'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
    HttpModule,
    EventsModule,
  ],
})
export class IntegrationsModule {}
