import { Test } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException, NotFoundException } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { faker } from '@faker-js/faker';

describe('AuthService', () => {
  let service: AuthService;
  let prismaService: PrismaService;
  let mockUser;

  beforeAll(async () => {
    mockUser = {
      id: 1,
      username: faker.internet.userName(),
      nickname: faker.person.firstName(),
      password: faker.internet.password(),
      email: faker.internet.email(),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn().mockResolvedValue(mockUser),
            },
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('accessToken'),
          },
        },
      ],
    }).compile();

    service = moduleRef.get<AuthService>(AuthService);
    prismaService = moduleRef.get<PrismaService>(PrismaService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should throw NotFoundException when user is not found', async () => {
    jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);

    await expect(
      service.login('notfound@404.com', 'passwordNotFound'),
    ).rejects.toThrow(NotFoundException);
  });

  it('should throw UnauthorizedException when password is invalid', async () => {
    jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(mockUser);
    jest
      .spyOn(bcrypt, 'compare')
      .mockImplementation(() => Promise.resolve(false));

    await expect(
      service.login(mockUser.email, 'invalidPassword'),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should return accessToken when email and password are valid', async () => {
    jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(mockUser);
    jest
      .spyOn(bcrypt, 'compare')
      .mockImplementation(() => Promise.resolve(true));

    const result = await service.login(mockUser.email, mockUser.password);

    expect(result).toEqual({ accessToken: 'accessToken' });
  });
});
