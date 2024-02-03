import { execSync } from 'node:child_process';
import request from 'supertest';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';

import { app } from '../src/app';
import { meals } from './mocks/meals';
import { users } from './mocks/users';

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
      .send(users[0])
      .expect(201);

    expect(createUserResponse.body).toEqual(
      expect.objectContaining({
        user_id: expect.stringMatching(/\S/),
        token: expect.stringMatching(/\S/),
      }),
    );
  });

  it('should be able to authenticate as a user', async () => {
    await request(app.server).post('/signup').send(users[0]).expect(201);

    const loginResponse = await request(app.server)
      .post('/signin')
      .send(users[0])
      .expect(200);

    expect(loginResponse.body).toEqual(
      expect.objectContaining({
        user_id: expect.stringMatching(/\S/),
        token: expect.stringMatching(/\S/),
      }),
    );
  });

  it('should be able to get meals metrics from a user', async () => {
    const createUserResponse = await request(app.server)
      .post('/signup')
      .send(users[0])
      .expect(201);

    await request(app.server)
      .post('/meals')
      .set('Authorization', `Bearer ${createUserResponse.body.token}`)
      .send(meals[0])
      .expect(201);

    await request(app.server)
      .post('/meals')
      .set('Authorization', `Bearer ${createUserResponse.body.token}`)
      .send(meals[1])
      .expect(201);

    await request(app.server)
      .post('/meals')
      .set('Authorization', `Bearer ${createUserResponse.body.token}`)
      .send(meals[2])
      .expect(201);

    await request(app.server)
      .post('/meals')
      .set('Authorization', `Bearer ${createUserResponse.body.token}`)
      .send(meals[3])
      .expect(201);

    const getMetricsResponse = await request(app.server)
      .get('/users/metrics')
      .set('Authorization', `Bearer ${createUserResponse.body.token}`)
      .expect(200);

    expect(getMetricsResponse.body).toEqual(
      expect.objectContaining({
        totalMeans: 4,
        totalMealsOnDiet: 3,
        totalMealsOffDiet: 1,
        bestOnDietSequence: 2,
      }),
    );
  });
});
