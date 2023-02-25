import { Injectable } from '@nestjs/common';
import { JiraStrategy } from './jira-strategy/jira-strategy';

@Injectable()
export class JiraService {
  constructor(private readonly jiraStrategy: JiraStrategy) {}

  generateUrl() {
    return this.jiraStrategy.generateUrl();
  }

  callback(url: string) {
    const tokens = this.jiraStrategy.getUserTokens(url);

    return;
  }
}
