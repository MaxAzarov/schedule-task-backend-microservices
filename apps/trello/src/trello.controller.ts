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
import { EventType } from '@app/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TrelloService } from './trello.service';
import { normalizeTrelloEvents } from './helpers/normalizeEvents';
import { MarkCardAsDoneDto } from './dto/mark-card-as-done.dto';
import { GetUserCardsDto } from './dto/get-user-cards.dto';
import { GetBoardListDto } from './dto/get-board-list.dto';

@ApiTags('trello')
@Controller({ path: 'trello', version: '1' })
export class TrelloController {
  constructor(
    private readonly trelloService: TrelloService,
    // private readonly messageGateway: MessageGateway,
  ) {}

  @Get('auth')
  async trelloAuth(@Res() res) {
    const redirectUrl = await this.trelloService.auth();

    return res.redirect(redirectUrl + '&scope=read,write');
  }

  @Get('auth/callback')
  async trelloAuthCallback(@Req() req, @Res() res) {
    const response = await this.trelloService.callback(req.url);

    res.redirect(
      `http://localhost:3000/profile?accessToken=${response.accessToken}&refreshToken=${response.accessTokenSecret}&type=${EventType.Trello}`,
    );
  }

  @MessagePattern('boards')
  getTrelloBoards(accessToken: string) {
    return this.trelloService.getBoards(accessToken);
  }

  @MessagePattern('board_list')
  getBoardList(@Payload() data: GetBoardListDto) {
    return this.trelloService.getBoardList(data);
  }

  @MessagePattern('user_cards')
  async getUserCards(@Payload() data: GetUserCardsDto) {
    const cards = await this.trelloService.getUserCards(data);
    return normalizeTrelloEvents(cards);
  }

  @MessagePattern('mark_as_done')
  markAsDoneCard(@Payload() data: MarkCardAsDoneDto) {
    return this.trelloService.markAsDoneCard(data);
  }

  @MessagePattern('me')
  me(token: string) {
    return this.trelloService.me(token);
  }

  @Post('webhook/callback')
  @HttpCode(HttpStatus.OK)
  async handleWebhookpost(@Req() req, @Res() res) {
    // this.messageGateway.emit({});

    res.json({ ok: 'ok' });
  }
}
