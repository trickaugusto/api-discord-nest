import { faker } from '@faker-js/faker';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import * as request from 'supertest';

describe('DiscordBot (e2e)', () => {
  let app: INestApplication;
  let jwtService: JwtService;
  let accessToken: string;
  let userId: string;
  let botId: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    jwtService = moduleFixture.get<JwtService>(JwtService);
    app = moduleFixture.createNestApplication();
    await app.init();

    const user = await createUser();
    userId = user.response.body.id;
    accessToken = user.accessToken;

    const bot = await createBot(userId, accessToken);
    botId = bot.body.id;
  });

  async function createUser() {
    const mockUser = {
      username: faker.internet.userName(),
      nickname: faker.person.firstName(),
      password: faker.internet.password(),
      email: faker.internet.email(),
    };

    const user = await request(app.getHttpServer())
      .post('/users')
      .send(mockUser)
      .expect(201);

    const accessToken = jwtService.sign({ userId: user.body.id });

    return { response: user, accessToken: accessToken };
  }

  async function createBot(userId: string, accessToken: string) {
    const bot = {
      name: faker.internet.userName(),
      token: faker.internet.password(),
      owner_id: userId,
    };

    return await request(app.getHttpServer())
      .post('/discord-bot')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(bot)
      .expect(201);
  }

  it('should return 201 when creating a new discord bot', async () => {
    const bot = {
      name: faker.internet.userName(),
      token: faker.internet.password(),
      owner_id: userId,
    };

    const createdBot = await request(app.getHttpServer())
      .post('/discord-bot')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(bot)
      .expect(201);

    botId = createdBot.body.id;
  });

  it('should successfully retrieve a bot via /discord-bot/:id (GET)', async () => {
    const retrievedBot = await request(app.getHttpServer())
      .get(`/discord-bot/${botId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(retrievedBot.body.id).toEqual(botId);
  });

  it('should return 200 when retrieving all bots by owner_id via /discord-bot/owner/:owner_id (GET)', async () => {
    const retrievedBots = await request(app.getHttpServer())
      .get(`/discord-bot/owner/${userId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    const botIds = retrievedBots.body.map((bot) => bot.id);
    expect(botIds).toContain(botId);
  });

  it('should return 404 when attempting to retrieve a bot that does not exist', async () => {
    return request(app.getHttpServer())
      .get('/discord-bot/0')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(404);
  });

  it('should return 400 when attempting to retrieve a bot with a non-numeric id', async () => {
    return request(app.getHttpServer())
      .get('/discord-bot/abc')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(400);
  });

  it('should return 200 when updating a bot via /discord-bot/:id (PATCH)', async () => {
    const updatedBot = await request(app.getHttpServer())
      .patch(`/discord-bot/${botId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ name: 'updatedBotName' })
      .expect(200);

    expect(updatedBot.body.name).toEqual('updatedBotName');
  });

  afterEach(async () => {
    await request(app.getHttpServer())
      .delete(`/users/${userId}`)
      .set('Authorization', `Bearer ${accessToken}`);

    await app.close();
  });
});
