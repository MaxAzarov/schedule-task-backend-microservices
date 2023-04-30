import { ApiTags } from '@nestjs/swagger/dist';
import { Controller, Get, Post, Req, Res, Request } from '@nestjs/common';
import { Request as IRequest } from 'express';
import { JiraService } from './jira.service';
import { HttpCode, UseGuards } from '@nestjs/common/decorators';
import { HttpStatus } from '@nestjs/common/enums';
import { IntegrationType } from 'src/integrations/types';
import { JwtAuthGuard } from 'src/auth/guards';

@ApiTags('jira')
@Controller({ path: 'jira' })
export class JiraController {
  constructor(private readonly jiraService: JiraService) {}

  @Get('auth')
  async login(@Res() res) {
    res.redirect(this.jiraService.generateUrl());
  }

  @Get('auth/callback')
  async authCallback(@Req() req, @Res() res) {
    const { access_token, refresh_token } = await this.jiraService.callback(
      req.url,
    );

    res.redirect(
      `http://localhost:3000/profile?accessToken=${access_token}&refreshToken=${refresh_token}&type=${IntegrationType.jira}`,
    );
  }

  @Get('boards')
  @UseGuards(JwtAuthGuard)
  async getBoards(@Request() request: IRequest) {
    const userId = (request as any).user.id;
    return this.jiraService.getBoards(userId);
  }

  // @Get('project')
  // async getProjectDetails() {
  //   this.jiraService.getProjectDetails('', '', '');
  // }

  @Get('issues')
  async getAllIssues() {
    this.jiraService.getAllIssues('', '');
  }

  @Get('project/statuses')
  @UseGuards(JwtAuthGuard)
  async getAllProjectStatuses(@Request() request: IRequest) {
    const userId = (request as any).user.id;
    return this.jiraService.getProjectStatus(userId);
  }

  // @Get('project/user/issues')
  // async getAllUsersIssuesInStatus() {
  //   this.jiraService.getAllUsersIssuesInStatus('', '', '', '');
  // }

  @Post('webhook')
  async createWebhook() {
    this.jiraService.createWebhook('FIRST', 'In Progress');
  }

  @Post('webhook/callback')
  @HttpCode(HttpStatus.OK)
  async handleWebhookpost(@Req() req, @Res() res) {
    // const callbackData = req.body;

    res.json({ ok: 'ok' });
  }

  @Get('me')
  async me() {
    this.jiraService.me('');
  }
}
