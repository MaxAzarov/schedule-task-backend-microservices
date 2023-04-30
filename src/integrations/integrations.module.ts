import { Module, forwardRef } from '@nestjs/common';
import { IntegrationsController } from './integrations.controller';
import { IntegrationsService } from './integrations.service';
import { TrelloModule } from 'src/trello/trello.module';
import { TrelloService } from 'src/trello/trello.service';
import { TrelloStrategy } from 'src/trello/strategy/trello-strategy';
import { HttpModule } from '@nestjs/axios';
import { JiraModule } from 'src/jira/jira.module';
import { JiraService } from 'src/jira/jira.service';
import { JiraStrategy } from 'src/jira/jira-strategy/jira-strategy';

@Module({
  controllers: [IntegrationsController],
  providers: [
    IntegrationsService,
    TrelloService,
    TrelloStrategy,
    JiraService,
    JiraStrategy,
  ],
  imports: [HttpModule, JiraModule, forwardRef(() => TrelloModule)],
})
export class IntegrationsModule {}
