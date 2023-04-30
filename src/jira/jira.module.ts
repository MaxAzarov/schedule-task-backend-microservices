import { Module, forwardRef } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { JiraStrategy } from './jira-strategy/jira-strategy';
import { JiraController } from './jira.controller';
import { JiraService } from './jira.service';
import { IntegrationsModule } from 'src/integrations/integrations.module';
import { IntegrationsService } from 'src/integrations/integrations.service';
import { TrelloModule } from 'src/trello/trello.module';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { TrelloStrategy } from 'src/trello/strategy/trello-strategy';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/users.service';
import { TrelloService } from 'src/trello/trello.service';

@Module({
  imports: [
    HttpModule,
    AuthModule,
    UsersModule,
    JwtModule,
    forwardRef(() => IntegrationsModule),
    forwardRef(() => TrelloModule),
  ],
  controllers: [JiraController],
  providers: [
    JiraService,
    JiraStrategy,
    IntegrationsService,
    TrelloStrategy,
    AuthService,
    UsersService,
    IntegrationsService,
    TrelloService,
    JiraService,
    JiraStrategy,
  ],
})
export class JiraModule {}
