import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';  // Changed to default import
import { AppModule } from '../src/app.module';

describe('App E2E', () => {
  let app: INestApplication;
  let jwtToken: string;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });
  it('/auth/login (POST) - success', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'john@example.com', password: 'password123' })
      .expect(201);

    expect(response.body).toHaveProperty('access_token');
    jwtToken = response.body.access_token;
  });

  it('/users/:userId/profiles (GET) - authorized access', async () => {
    const response = await request(app.getHttpServer())
      .get('/users/1/profiles')
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
  });

  afterAll(async () => {
    await app.close();
  });
});
