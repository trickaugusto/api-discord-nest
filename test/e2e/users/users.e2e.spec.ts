import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../../src/app.module';
import { faker } from '@faker-js/faker';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let mockUser;

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

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  async function createUser() {
    return await request(app.getHttpServer())
      .post('/users')
      .send(mockUser)
      .expect(201);
  }

  it('should return 400 and validation message when non-numeric id is passed to /users/:id (GET)', () => {
    return request(app.getHttpServer())
      .get('/users/abc')
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
    const response = await createUser();

    for (const key in mockUser) {
      expect(response.body[key]).toEqual(mockUser[key]);
    }

    await request(app.getHttpServer())
      .delete(`/users/${response.body.id}`)
      .expect(200);
  });

  it('should successfully retrieve a user via /users/:id (GET)', async () => {
    const responsePost = await createUser();

    const responseGet = await request(app.getHttpServer())
      .get(`/users/${responsePost.body.id}`)
      .expect(200);

    for (const key in mockUser) {
      expect(responseGet.body[key]).toEqual(mockUser[key]);
    }
  });

  it('should successfully update a user via /users/:id (PATCH)', async () => {
    const responsePost = await createUser();
    const updatedUser = { ...mockUser, username: 'Updated Name' };

    const responsePut = await request(app.getHttpServer())
      .patch(`/users/${responsePost.body.id}`)
      .send(updatedUser)
      .expect(200);

    for (const key in updatedUser) {
      expect(responsePut.body[key]).toEqual(updatedUser[key]);
    }
  });

  it('should successfully retrieve a list of users via /users (GET)', async () => {
    await createUser();

    const responseGet = await request(app.getHttpServer())
      .get('/users')
      .expect(200);

    expect(Array.isArray(responseGet.body)).toBe(true);
    expect(responseGet.body.length).toBeGreaterThan(0);
  });

  afterAll(async () => {
    await app.close();
  });
});
