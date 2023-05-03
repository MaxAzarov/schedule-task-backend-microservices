import {
  Controller,
  Get,
  Req,
  Res,
  Post,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
} from '@nestjs/common';
import { Request as IRequest } from 'express';
import { ApiTags } from '@nestjs/swagger/dist';
import { TrelloService } from './trello.service';
import { WebhookCallback } from './types/WebhookCallback';
import { IntegrationType } from 'src/integrations/types';
import { JwtAuthGuard } from 'src/auth/guards';

@ApiTags('trello')
@Controller({ path: 'trello', version: '1' })
export class TrelloController {
  constructor(private readonly trelloService: TrelloService) {}

  @Get('auth')
  async trelloAuth(@Res() res) {
    const redirectUrl = await this.trelloService.auth();

    res.redirect(redirectUrl + '&scope=read,write');
  }

  @Get('auth/callback')
  async trelloAuthCallback(@Req() req, @Res() res) {
    const response = await this.trelloService.callback(req.url);

    res.redirect(
      `http://localhost:3000/profile?accessToken=${response.accessToken}&refreshToken=${response.accessTokenSecret}&type=${IntegrationType.trello}`,
    );
  }

  @Get('boards')
  @UseGuards(JwtAuthGuard)
  async getBoards(@Request() request: IRequest) {
    const userId = (request as any).user.id;
    return this.trelloService.getBoards(userId);
  }

  // @Get('me')
  // async me() {
  //   this.trelloService.me('');
  // }

  @Get('board/list')
  @UseGuards(JwtAuthGuard)
  async boardList(@Request() request: IRequest) {
    const userId = (request as any).user.id;
    return this.trelloService.getBoardList(userId);
  }

  @Get('list/cards')
  @UseGuards(JwtAuthGuard)
  async listCards() {
    this.trelloService.createWebhook('', '');
  }

  @Get('user/cards')
  @UseGuards(JwtAuthGuard)
  async userCards(@Request() request: IRequest) {
    const userId = (request as any).user.id;
    return this.trelloService.getUserCards(userId);
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
