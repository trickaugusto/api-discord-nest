import { Test, TestingModule } from '@nestjs/testing';
import { DiscordBotController } from 'src/discord-bot/discord-bot.controller';
import { DiscordBotService } from 'src/discord-bot/discord-bot.service';
import { PrismaService } from 'src/prisma/prisma.service';

describe('DiscordBotController', () => {
  let controller: DiscordBotController;
  let service: DiscordBotService;
  let mockDiscordBot;

  beforeAll(async () => {
    mockDiscordBot = {
      id: 1,
      name: 'testbot',
      token: 'testtoken',
      owner_id: 1,
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [DiscordBotController],
      providers: [
        DiscordBotService,
        {
          provide: PrismaService,
          useValue: {
            create: jest.fn(),
            findAllByOwnerId: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<DiscordBotController>(DiscordBotController);
    service = module.get<DiscordBotService>(DiscordBotService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  async function validateDiscordBot(responseBot, mockDiscordBot) {
    expect(responseBot).toBeDefined();
    expect(responseBot.id).toEqual(mockDiscordBot.id);
    expect(responseBot.name).toEqual(mockDiscordBot.name);
    expect(responseBot.token).toEqual(mockDiscordBot.token);
    expect(responseBot.owner_id).toEqual(mockDiscordBot.owner_id);
  }

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a new discord bot', async () => {
    service.create = jest.fn().mockResolvedValueOnce(mockDiscordBot);
    const result = await controller.create(mockDiscordBot);

    await validateDiscordBot(result, mockDiscordBot);
  });

  it('should return an array of discord bots by owner_id', async () => {
    service.findAllByOwnerId = jest
      .fn()
      .mockResolvedValueOnce([mockDiscordBot]);
    const result = await controller.findAllByOwnerId(mockDiscordBot.id);

    await validateDiscordBot(result, [mockDiscordBot]);
  });

  it('should return a discord bot by ID', async () => {
    service.findOne = jest.fn().mockResolvedValueOnce(mockDiscordBot);
    const result = await controller.findOne(1);

    await validateDiscordBot(result, mockDiscordBot);
  });

  it('should update a discord bot by ID', async () => {
    service.update = jest.fn().mockResolvedValueOnce(mockDiscordBot);
    service.findOne = jest.fn().mockResolvedValueOnce(mockDiscordBot);

    const result = await controller.update(1, mockDiscordBot);

    await validateDiscordBot(result, mockDiscordBot);
  });

  it('should remove a discord bot by ID', async () => {
    service.findOne = jest.fn().mockResolvedValueOnce(mockDiscordBot);
    service.remove = jest.fn().mockResolvedValueOnce(undefined);

    const result = await controller.remove(1);
    expect(result).toEqual({});
  });
});
