import { Test, TestingModule } from '@nestjs/testing';
import { EventsService } from './events.service';
import { getEntityManagerToken } from '@nestjs/typeorm';

describe('EventsService', () => {
  let service: EventsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsService,
        {
          provide: getEntityManagerToken(),
          useValue: {
            getRepository: () => ({
              create: jest.fn(),
              softDelete: jest.fn(),
              delete: jest.fn(),
            }),
          },
        },
      ],
    }).compile();

    service = module.get<EventsService>(EventsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
