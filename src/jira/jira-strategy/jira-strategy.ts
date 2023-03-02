import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import * as crypto from 'crypto';
import * as url from 'url';
import { firstValueFrom, map } from 'rxjs';

@Injectable()
export class JiraStrategy {
  constructor(
    private readonly configService: ConfigService,
    private readonly http: HttpService,
  ) {}

  generateUrl() {
    const id = crypto.randomBytes(20).toString('hex');

    const consumerKey = this.configService.get<string>('JIRA_CLIENT_KEY');

    const callbackUrl = this.configService.get<string>('JIRA_CLIENT_CALLBACK');
    const scope =
      'read:jira-work read read:user.property:jira offline_access read:user:jira read:project:jira read:issue:jira read:issue:jira-software delete:board-scope.admin:jira-software delete:sprint:jira-software read:board-scope:jira-software read:board-scope.admin:jira-software read:build:jira-software read:deployment:jira-software read:epic:jira-software read:feature-flag:jira-software read:remote-link:jira-software read:source-code:jira-software read:sprint:jira-software write:board-scope:jira-software write:board-scope.admin:jira-software write:build:jira-software write:deployment:jira-software write:epic:jira-software write:feature-flag:jira-software write:issue:jira-software write:remote-link:jira-software write:source-code:jira-software write:sprint:jira-software read:project.avatar:jira read:project.component:jira read:project.email:jira read:project.feature:jira read:project.property:jira read:project-version:jira read:project-type:jira read:project-role:jira read:project-category:jira read:issue-type-hierarchy:jira read:application-role:jira read:issue-type:jira read:avatar:jira write:project:jira delete:project:jira read:group:jira delete:group:jira write:group:jira read:issue-details:jira';

    return `https://auth.atlassian.com/authorize?audience=api.atlassian.com&client_id=${consumerKey}&scope=${scope}&redirect_uri=${callbackUrl}&state=${id}&response_type=code&prompt=consent`;
  }

  async getUserTokens(reqUrl: string) {
    const data = url.parse(reqUrl, true).query;

    const consumerKey = this.configService.get<string>('JIRA_CLIENT_KEY');
    const secretKey = this.configService.get<string>('JIRA_CLIENT_SECRET');
    const callbackUrl = this.configService.get<string>('JIRA_CLIENT_CALLBACK');

    const response = await firstValueFrom<{
      access_token: string;
      expires_in: number;
      token_type: string;
      refresh_token: string;
    }>(
      this.http
        .post(
          'https://auth.atlassian.com/oauth/token',
          JSON.stringify({
            grant_type: 'authorization_code',
            client_id: consumerKey,
            client_secret: secretKey,
            code: data.code,
            redirect_uri: callbackUrl,
          }),
          { headers: { 'Content-type': 'application/json' } },
        )
        .pipe(map((x) => x.data)),
    );

    return response;
  }
}
