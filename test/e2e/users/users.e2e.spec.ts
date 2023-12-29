import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../../src/app.module';
import { faker } from '@faker-js/faker';
import { JwtService } from '@nestjs/jwt';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let jwtService: JwtService;
  let mockUser;
  const createdUsersByTest = [];

  beforeEach(async () => {
    mockUser = {
      username: faker.internet.userName(),
      nickname: faker.person.firstName(),
      password: faker.internet.password(),
      email: faker.internet.email(),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    jwtService = moduleFixture.get<JwtService>(JwtService);
    app = moduleFixture.createNestApplication();
    await app.init();
  });

  async function validateUser(responseUser, mockUser) {
    expect(Number.isInteger(responseUser.id)).toBe(true);
    expect(responseUser.username).toEqual(mockUser.username);
    expect(responseUser.nickname).toEqual(mockUser.nickname);
    expect(responseUser.email).toEqual(mockUser.email);
  }

  async function createUser() {
    const user = await request(app.getHttpServer())
      .post('/users')
      .send(mockUser)
      .expect(201);

    const accessToken = jwtService.sign({ userId: user.body.id });
    createdUsersByTest.push({ id: user.body.id, accessToken: accessToken });

    return { response: user, accessToken: accessToken };
  }

  it('should return 400 and validation message when non-numeric id is passed to /users/:id (GET)', async () => {
    const { accessToken } = await createUser();

    return request(app.getHttpServer())
      .get('/users/abc')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(400)
      .expect((res) => {
        if (
          res.body.message !== 'Validation failed (numeric string is expected)'
        ) {
          throw new Error('Validation message does not match');
        }
      });
  });

  it('should successfully create and delete a user via /users (POST) and /users/:id (DELETE)', async () => {
    const { response, accessToken } = await createUser();
    await validateUser(response.body, mockUser);

    await request(app.getHttpServer())
      .delete(`/users/${response.body.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);
  });

  it('should successfully retrieve a user via /users/:id (GET)', async () => {
    const { response, accessToken } = await createUser();

    const responseGet = await request(app.getHttpServer())
      .get(`/users/${response.body.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    await validateUser(responseGet.body, mockUser);
  });

  it('should successfully update a user via /users/:id (PATCH)', async () => {
    const { response, accessToken } = await createUser();
    const updatedUser = { ...mockUser, username: 'Updated Name' };

    const responsePut = await request(app.getHttpServer())
      .patch(`/users/${response.body.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send(updatedUser)
      .expect(200);

    await validateUser(responsePut.body, updatedUser);
  });

  it('should successfully retrieve a list of users via /users (GET)', async () => {
    const { accessToken } = await createUser();

    const responseGet = await request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(Array.isArray(responseGet.body)).toBe(true);
    expect(responseGet.body.length).toBeGreaterThan(0);
  });

  afterAll(async () => {
    for (const user of createdUsersByTest) {
      await request(app.getHttpServer())
        .delete(`/users/${user.id}`)
        .set('Authorization', `Bearer ${user.accessToken}`);
    }

    await app.close();
  });
});
