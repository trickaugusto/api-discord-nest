import { Test } from '@nestjs/testing';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { PrismaService } from 'src/prisma/prisma.service';

describe('UsersService', () => {
  let service: UsersService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user', async () => {
    const createUserDto: CreateUserDto = {
      username: 'exemploUsername',
      nickname: 'exemploNickname',
      password: 'exemploSenha',
      email: 'exemplo@email.com',
    };
    await service.create(createUserDto);
    expect(prisma.user.create).toHaveBeenCalledWith({ data: createUserDto });
  });

  // TODO: test the other methods
});
