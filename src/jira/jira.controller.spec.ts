import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { JiraStrategy } from './jira-strategy/jira-strategy';
import { JiraController } from './jira.controller';
import { JiraService } from './jira.service';

describe('JiraController', () => {
  let controller: JiraController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JiraController],
      imports: [HttpModule],
      providers: [JiraStrategy, ConfigService, JiraService],
    }).compile();

    controller = module.get<JiraController>(JiraController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
