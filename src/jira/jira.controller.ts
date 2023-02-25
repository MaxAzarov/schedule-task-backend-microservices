import { ApiTags } from '@nestjs/swagger/dist';
import { Controller, Get, Req, Res } from '@nestjs/common';

import { JiraService } from './jira.service';

@ApiTags('jira')
@Controller({ path: 'jira' })
export class JiraController {
  constructor(private readonly jiraService: JiraService) {}

  @Get('auth')
  async login(@Res() res) {
    res.redirect(this.jiraService.generateUrl());
  }

  @Get('auth/callback')
  async authCallback(@Req() req) {
    this.jiraService.callback(req.url);
  }
}
