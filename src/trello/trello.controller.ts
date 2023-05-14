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
import { EventType } from 'src/integrations/types';
import { JwtAuthGuard } from 'src/auth/guards';
import { MessageGateway } from 'src/integrations/message.gateway';

@ApiTags('trello')
@Controller({ path: 'trello', version: '1' })
export class TrelloController {
  constructor(
    private readonly trelloService: TrelloService,
    private readonly messageGateway: MessageGateway,
  ) {}

  @Get('auth')
  async trelloAuth(@Res() res) {
    const redirectUrl = await this.trelloService.auth();

    res.redirect(redirectUrl + '&scope=read,write');
  }

  @Get('auth/callback')
  async trelloAuthCallback(@Req() req, @Res() res) {
    const response = await this.trelloService.callback(req.url);

    res.redirect(
      `http://localhost:3000/profile?accessToken=${response.accessToken}&refreshToken=${response.accessTokenSecret}&type=${EventType.trello}`,
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

  @Get('user/cards')
  @UseGuards(JwtAuthGuard)
  async userCards(@Request() request: IRequest) {
    const userId = (request as any).user.id;
    return this.trelloService.getUserCards(userId);
  }

  @Get('webhook/callback')
  @HttpCode(HttpStatus.OK)
  async handleWebhook(@Req() req, @Res() res) {
    res.json({ ok: 'ok' });
  }

  @Post('webhook/callback')
  @HttpCode(HttpStatus.OK)
  async handleWebhookpost(@Req() req, @Res() res) {
    this.messageGateway.emit({});

    res.json({ ok: 'ok' });
  }
}
