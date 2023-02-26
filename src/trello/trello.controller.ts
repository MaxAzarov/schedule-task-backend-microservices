import {
  Controller,
  Get,
  Req,
  Res,
  Post,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger/dist';
import { TrelloService } from './trello.service';
import { WebhookCallback } from './types/WebhookCallback';

@ApiTags('trello')
@Controller({ path: 'trello', version: '1' })
export class TrelloController {
  constructor(public readonly trelloService: TrelloService) {}

  @Get('auth')
  async trelloAuth(@Res() res) {
    const redirectUrl = await this.trelloService.auth();

    res.redirect(redirectUrl);
  }

  @Get('auth/callback')
  async trelloAuthCallback(@Req() req) {
    this.trelloService.callback(req.url);
  }

  @Get('/test')
  @HttpCode(HttpStatus.OK)
  async test(@Res() res) {
    res.send('test');
  }

  @Get('boards')
  async getBoards() {
    this.trelloService.getBoards('');
  }

  @Get('me')
  async me() {
    this.trelloService.me('');
  }

  @Get('board/list')
  async boardList() {
    this.trelloService.getBoardList('', '');
  }

  @Get('list/cards')
  async listCards() {
    this.trelloService.createWebhook('', '');
  }

  @Get('list/user/cards')
  async userCards() {
    this.trelloService.getUserCards('', '', '');
  }

  @Post('webhook')
  async createWebhook() {
    this.trelloService.createWebhook('', '');
  }

  @Post('webhook/callback')
  @HttpCode(HttpStatus.OK)
  async handleWebhookpost(@Req() req, @Res() res) {
    const callbackData = req.body as WebhookCallback;

    res.json({ ok: 'ok' });
  }
}
