import { Controller, Get, Req, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger/dist';
import { TrelloService } from './trello.service';

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
}
