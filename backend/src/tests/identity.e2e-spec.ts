import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';

import { AppModule } from '../app.module';

describe('Identity & Admin Actions (e2e)', () => {
  let app: INestApplication;
  let server: any;
  let tokenA: string, tokenB: string;
  let ctxId: number, profileId: number;
  let userAId: number, userBId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
    server = app.getHttpServer();
  });

  it('Register two users (A is admin, B is normal)', async () => {
    await request(server).post('/auth/register').send({ email: 'a@t.com', password: 'Test1234' });
    await request(server).post('/auth/register').send({ email: 'b@t.com', password: 'Test1234' });

    const resA = await request(server).post('/auth/login').send({ email: 'a@t.com', password: 'Test1234' });
    const resB = await request(server).post('/auth/login').send({ email: 'b@t.com', password: 'Test1234' });
    tokenA = resA.body.access_token;
    tokenB = resB.body.access_token;
    expect(tokenA).toBeDefined();
    expect(tokenB).toBeDefined();
  });

  it('User A creates a context and becomes admin', async () => {
    const res = await request(server)
      .post('/contexts')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({ name: 'MyCtx' });
    ctxId = res.body.id;
    expect(ctxId).toBeDefined();
  });

  it('User B joins the context', async () => {
    // Find userB's backend ID:
    const meB = await request(server).get('/users/me').set('Authorization', `Bearer ${tokenB}`);
    userBId = meB.body.id;
    const add = await request(server)
      .post(`/contexts/${ctxId}/members`)
      .set('Authorization', `Bearer ${tokenA}`)
      .send({ userId: userBId });
    expect(add.body.contextId).toEqual(ctxId);
  });

  it('User A promotes B to admin', async () => {
    await request(server)
      .patch(`/contexts/${ctxId}/members/${userBId}/role`)
      .set('Authorization', `Bearer ${tokenA}`)
      .send({ role: 'admin' })
      .expect(200);
  });

  it('User B renames context as admin', async () => {
    await request(server)
      .patch(`/contexts/${ctxId}`)
      .set('Authorization', `Bearer ${tokenB}`)
      .send({ name: 'MyCtxUpdated' })
      .expect(200);
  });

  it('User A creates a profile', async () => {
    const meA = await request(server).get('/users/me').set('Authorization', `Bearer ${tokenA}`);
    userAId = meA.body.id;
    const res = await request(server)
      .post(`/users/${userAId}/profiles/create`)
      .set('Authorization', `Bearer ${tokenA}`)
      .send({ name: 'TestProfile', label: 'Proj', displayName: 'A', visibility: 'public' });
    profileId = res.body.id;
    expect(profileId).toBeDefined();
  });

  it('User A edits then deletes profile', async () => {
    await request(server)
      .patch(`/users/${userAId}/profiles/${profileId}`)
      .set('Authorization', `Bearer ${tokenA}`)
      .send({ displayName: 'AA-updated', label: 'Projj' })
      .expect(200);
    await request(server)
      .delete(`/users/${userAId}/profiles/${profileId}`)
      .set('Authorization', `Bearer ${tokenA}`)
      .expect(200);
  });

  it('User A deletes context (as admin)', async () => {
    await request(server)
      .delete(`/contexts/${ctxId}`)
      .set('Authorization', `Bearer ${tokenA}`)
      .expect(200);
  });

  it('User B cannot delete context after', async () => {
    await request(server)
      .delete(`/contexts/${ctxId}`)
      .set('Authorization', `Bearer ${tokenB}`)
      .expect(400);
  });

  it('GDPR: User B exports and deletes account', async () => {
    await request(server)
      .get('/contexts/me/export')
      .set('Authorization', `Bearer ${tokenB}`)
      .expect(200);
    await request(server)
      .delete('/contexts/me')
      .set('Authorization', `Bearer ${tokenB}`)
      .expect(200);
  });

  afterAll(async () => {
    await app.close();
  });
});
