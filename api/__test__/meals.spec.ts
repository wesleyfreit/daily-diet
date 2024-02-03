import { execSync } from 'node:child_process';
import request from 'supertest';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';

import { app } from '../src/app';
import { meals } from './mocks/meals';
import { users } from './mocks/users';

describe('Meals routes', () => {
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

  it('should be able to create a new meal for a user', async () => {
    const createUserResponse = await request(app.server)
      .post('/signup')
      .send(users[1])
      .expect(201);

    await request(app.server)
      .post('/meals')
      .set('Authorization', `Bearer ${createUserResponse.body.token}`)
      .send(meals[0])
      .expect(201);
  });

  it('should be able to list all meals from a user', async () => {
    const createUserResponse = await request(app.server)
      .post('/signup')
      .send(users[1])
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

    const listMealsResponse = await request(app.server)
      .get('/meals')
      .set('Authorization', `Bearer ${createUserResponse.body.token}`)
      .expect(200);

    expect(listMealsResponse.body.meals).toHaveLength(2);

    expect(listMealsResponse.body.meals[0].name).toBe(meals[0].name);
  });

  it('should be able to get a specific meal from a user', async () => {
    const createUserResponse = await request(app.server)
      .post('/signup')
      .send(users[1])
      .expect(201);

    await request(app.server)
      .post('/meals')
      .set('Authorization', `Bearer ${createUserResponse.body.token}`)
      .send(meals[0])
      .expect(201);

    const listMealsResponse = await request(app.server)
      .get('/meals')
      .set('Authorization', `Bearer ${createUserResponse.body.token}`)
      .expect(200);

    const mealId = listMealsResponse.body.meals[0].id;

    const getMealResponse = await request(app.server)
      .get(`/meals/${mealId}`)
      .set('Authorization', `Bearer ${createUserResponse.body.token}`)
      .expect(200);

    expect(getMealResponse.body.meal.id).toBe(mealId);
    expect(getMealResponse.body.meal.name).toBe(meals[0].name);
  });

  it('should be able to modify all data for a registered meal from a user', async () => {
    const createUserResponse = await request(app.server)
      .post('/signup')
      .send(users[1])
      .expect(201);

    await request(app.server)
      .post('/meals')
      .set('Authorization', `Bearer ${createUserResponse.body.token}`)
      .send(meals[0])
      .expect(201);

    const listMealsResponse = await request(app.server)
      .get('/meals')
      .set('Authorization', `Bearer ${createUserResponse.body.token}`)
      .expect(200);

    const mealId = listMealsResponse.body.meals[0].id;

    await request(app.server)
      .put(`/meals/${mealId}`)
      .set('Authorization', `Bearer ${createUserResponse.body.token}`)
      .send(meals[1])
      .expect(204);
  });

  it('should be able to delete a meal from a user', async () => {
    const createUserResponse = await request(app.server)
      .post('/signup')
      .send(users[1])
      .expect(201);

    await request(app.server)
      .post('/meals')
      .set('Authorization', `Bearer ${createUserResponse.body.token}`)
      .send(meals[0])
      .expect(201);

    const listMealsResponse = await request(app.server)
      .get('/meals')
      .set('Authorization', `Bearer ${createUserResponse.body.token}`)
      .expect(200);

    const mealId = listMealsResponse.body.meals[0].id;

    await request(app.server)
      .delete(`/meals/${mealId}`)
      .set('Authorization', `Bearer ${createUserResponse.body.token}`)
      .expect(204);
  });
});
