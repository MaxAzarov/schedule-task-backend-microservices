import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { TrelloStrategy } from './strategy/trello-strategy';
import { TrelloService } from './trello.service';

describe('TrelloService', () => {
  let service: TrelloService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TrelloService, TrelloStrategy, ConfigService],
      imports: [HttpModule],
    }).compile();

    service = module.get<TrelloService>(TrelloService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
