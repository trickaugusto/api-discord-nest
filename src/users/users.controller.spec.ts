import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { faker } from '@faker-js/faker';
import { NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;
  let mockUser;
  let module: TestingModule;

  beforeAll(async () => {
    mockUser = {
      id: 1,
      username: faker.internet.userName(),
      nickname: faker.name.firstName(),
      password: faker.internet.password(),
      email: faker.internet.email(),
      created_at: new Date(),
      updated_at: new Date(),
    };

    module = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn().mockResolvedValue(mockUser),
            },
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new user', async () => {
    service.create = jest.fn().mockResolvedValueOnce(mockUser);
    const result = await controller.create(mockUser);

    expect(result).toEqual(mockUser);
  });

  it('should return an array of users', async () => {
    service.findAll = jest.fn().mockResolvedValueOnce([mockUser]);
    const result = await controller.findAll();

    expect(result).toEqual([mockUser]);
  });

  it('should return a user by ID', async () => {
    service.findOne = jest.fn().mockResolvedValueOnce(mockUser);
    const result = await controller.findOne('1');

    expect(result).toEqual(mockUser);
  });

  it('should update a user by ID', async () => {
    service.update = jest.fn().mockResolvedValueOnce(mockUser);
    service.findOne = jest.fn().mockResolvedValueOnce(mockUser);

    const result = await controller.update('1', mockUser);

    expect(result).toEqual(mockUser);
  });

  it('should remove a user by ID', async () => {
    service.findOne = jest.fn().mockResolvedValueOnce(mockUser);

    service.remove = jest.fn().mockResolvedValueOnce(undefined);
    const result = await controller.remove('1');

    expect(result).toBeUndefined();
  });

  it('should throw 404 error when user not found on update', async () => {
    service.findOne = jest.fn().mockResolvedValueOnce(null);

    await expect(controller.update('1', mockUser)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should throw 404 error when user not found on remove', async () => {
    service.findOne = jest.fn().mockResolvedValueOnce(null);

    await expect(controller.remove('1')).rejects.toThrow(NotFoundException);
  });
});
