import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { TrelloStrategy } from './strategy/trello-strategy';
import { TrelloController } from './trello.controller';
import { TrelloService } from './trello.service';

describe('TrelloController', () => {
  let controller: TrelloController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TrelloController],
      providers: [TrelloService, TrelloStrategy, ConfigService],
    }).compile();

    controller = module.get<TrelloController>(TrelloController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
