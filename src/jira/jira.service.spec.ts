import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { JiraStrategy } from './jira-strategy/jira-strategy';
import { JiraService } from './jira.service';

describe('JiraService', () => {
  let service: JiraService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [JiraService, JiraStrategy, ConfigService, HttpModule],
    }).compile();

    service = module.get<JiraService>(JiraService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
