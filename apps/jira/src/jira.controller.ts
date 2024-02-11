import { ApiTags } from '@nestjs/swagger/dist';
import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { HttpCode } from '@nestjs/common/decorators';
import { HttpStatus } from '@nestjs/common/enums';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { EventType, MessageGateway } from '@app/common';
import { JiraService } from './jira.service';
import { normalizeJiraEvents } from './helpers/normalizeEvents';
import { GetUserCardsDto } from './dto/get-user-cards.dto';
import { GetBoardsDto } from './dto/get-boards.dto';
import { GetMyselfDto } from './dto/get-myself.dto';
import { MarkCardAsDoneDto } from './dto/mark-card-as-done';

@ApiTags('jira')
@Controller({ path: 'jira' })
export class JiraController {
  constructor(
    private readonly jiraService: JiraService,
    private readonly messageGateway: MessageGateway,
  ) {}

  @Get('auth/callback')
  async authCallback(@Req() req, @Res() res) {
    const { access_token, refresh_token } = await this.jiraService.callback(
      req.url,
    );
    res.redirect(
      `http://localhost:3000/profile?accessToken=${access_token}&refreshToken=${refresh_token}&type=${EventType.Jira}`,
    );
  }

  @Get('auth')
  async login(@Res() res) {
    res.redirect(this.jiraService.generateUrl());
  }

  @MessagePattern('boards')
  getTrelloBoards(@Payload() data: GetBoardsDto) {
    return this.jiraService.getBoards(data);
  }

  @MessagePattern('me')
  me(accessToken: string) {
    return this.jiraService.me(accessToken);
  }

  @MessagePattern('myself')
  myself(@Payload() data: GetMyselfDto) {
    return this.jiraService.myself(data);
  }

  @MessagePattern('user_cards')
  async getCards(data: GetUserCardsDto) {
    return normalizeJiraEvents(
      await this.jiraService.getAllUsersIssuesInStatus(data),
    );
  }

  @MessagePattern('mark_as_done')
  markAsDoneCard(@Payload() data: MarkCardAsDoneDto) {
    return this.jiraService.markAsDoneCard(data);
  }

  @MessagePattern('project_statuses')
  async getProjectStatuses(data: {
    projectId: string;
    clientId: string;
    accessToken: string;
  }) {
    return await this.jiraService.getProjectStatuses(data);
  }

  @Post('webhook')
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async createWebhook() {}

  @Post('webhook/callback')
  @HttpCode(HttpStatus.OK)
  async handleWebhookpost(@Req() req, @Res() res) {
    this.messageGateway.emit({});

    res.json({ ok: 'ok' });
  }
}
