import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { JiraStrategy } from './jira-strategy/jira-strategy';
import { JiraController } from './jira.controller';
import { JiraService } from './jira.service';

@Module({
  imports: [HttpModule],
  controllers: [JiraController],
  providers: [JiraService, JiraStrategy],
})
export class JiraModule {}
