import { HttpModule } from '@nestjs/axios';
import { Module, forwardRef } from '@nestjs/common';
import { TrelloStrategy } from './strategy/trello-strategy';
import { TrelloController } from './trello.controller';
import { TrelloService } from './trello.service';
import { AuthService } from 'src/auth/auth.service';
import { AuthModule } from 'src/auth/auth.module';
import { UsersService } from 'src/users/users.service';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { IntegrationsModule } from 'src/integrations/integrations.module';
import { IntegrationsService } from 'src/integrations/integrations.service';
import { JiraService } from 'src/jira/jira.service';
import { JiraStrategy } from 'src/jira/jira-strategy/jira-strategy';

@Module({
  imports: [
    HttpModule,
    AuthModule,
    UsersModule,
    JwtModule,
    forwardRef(() => IntegrationsModule),
  ],
  controllers: [TrelloController],
  providers: [
    TrelloStrategy,
    AuthService,
    UsersService,
    IntegrationsService,
    TrelloService,
    JiraService,
    JiraStrategy,
  ],
})
export class TrelloModule {}
