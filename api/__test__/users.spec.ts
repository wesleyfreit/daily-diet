import { execSync } from 'node:child_process';
import request from 'supertest';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';

import { app } from '../src/app';

const user = {
  name: 'Richard',
  email: 'richard@gmail.com',
  password: '123456',
};

describe('User routes', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    execSync('pnpm run knex migrate:latest');
  });

  afterEach(() => {
    execSync('pnpm run knex migrate:rollback --all');
  });

  it('should be able to create a user', async () => {
    const createUserResponse = await request(app.server)
      .post('/signup')
      .send(user)
      .expect(201);

    expect(createUserResponse.body).toEqual(
      expect.objectContaining({
        user_id: expect.stringMatching(/\S/),
        token: expect.stringMatching(/\S/),
      }),
    );
  });

  it('should be able to authenticate as a user', async () => {
    await request(app.server).post('/signup').send(user).expect(201);

    const loginResponse = await request(app.server)
      .post('/signin')
      .send(user)
      .expect(200);

    expect(loginResponse.body).toEqual(
      expect.objectContaining({
        user_id: expect.stringMatching(/\S/),
        token: expect.stringMatching(/\S/),
      }),
    );
  });
});
