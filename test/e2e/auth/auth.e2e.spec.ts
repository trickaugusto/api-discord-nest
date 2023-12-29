import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { faker } from '@faker-js/faker';
import { JwtService } from '@nestjs/jwt';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let mockUser;
  let jwtService: JwtService;

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

  async function createUser() {
    const user = await request(app.getHttpServer())
      .post('/users')
      .send(mockUser)
      .expect(201);

    const accessToken = jwtService.sign({ userId: user.body.id });
    createdUsersByTest.push({ id: user.body.id, accessToken: accessToken });

    return { response: user, accessToken: accessToken };
  }

  it('should return 404 when user is not found', async () => {
    return await request(app.getHttpServer())
      .post('/auth/login')
      .send(mockUser)
      .expect(404)
      .expect((res) => {
        if (res.body.message !== `No user found for email: ${mockUser.email}`) {
          throw new Error('User not found message does not match');
        }
      });
  });

  it('should return 401 when password is invalid', async () => {
    await createUser();
    mockUser.password = 'invalidPassword';

    return await request(app.getHttpServer())
      .post('/auth/login')
      .send(mockUser)
      .expect(401)
      .expect((res) => {
        if (res.body.message !== 'Invalid password') {
          throw new Error('Invalid password');
        }
      });
  });

  it('should return 201 with accessToken when password and email is valid', async () => {
    await createUser();

    return await request(app.getHttpServer())
      .post('/auth/login')
      .send(mockUser)
      .expect(201)
      .expect((res) => {
        if (!res.body.accessToken) {
          throw new Error('Access token is missing');
        }
      });
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
