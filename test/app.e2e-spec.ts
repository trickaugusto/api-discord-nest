import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/users/:id (GET)', () => {
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

  // TO DO - add more tests

  afterAll(async () => {
    await app.close();
  });
});
