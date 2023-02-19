import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger/dist';

@ApiTags('trello')
@Controller({ path: 'trello' })
export class TrelloController {}
