import { execSync } from 'node:child_process';
import request from 'supertest';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';

import { app } from '../src/app';

const user = {
  name: 'Wesley',
  email: 'wesley@gmail.com',
  password: '123456',
};

const meal = {
  name: 'Breakfast',
  description: 'A good breakfast',
  date: new Date(),
  is_diet: true,
};

const meal2 = {
  name: 'Dinner',
  description: 'A good dinner',
  date: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day after
  is_diet: true,
};

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
      .send(user)
      .expect(201);

    await request(app.server)
      .post('/meals')
      .set('Authorization', `Bearer ${createUserResponse.body.token}`)
      .send(meal)
      .expect(201);
  });

  it('should be able to list all meals from a user', async () => {
    const createUserResponse = await request(app.server)
      .post('/signup')
      .send(user)
      .expect(201);

    await request(app.server)
      .post('/meals')
      .set('Authorization', `Bearer ${createUserResponse.body.token}`)
      .send(meal)
      .expect(201);

    await request(app.server)
      .post('/meals')
      .set('Authorization', `Bearer ${createUserResponse.body.token}`)
      .send(meal2)
      .expect(201);

    const listMealsResponse = await request(app.server)
      .get('/meals')
      .set('Authorization', `Bearer ${createUserResponse.body.token}`)
      .expect(200);

    expect(listMealsResponse.body.meals).toHaveLength(2);

    expect(listMealsResponse.body.meals[0].name).toBe(meal.name);
  });

  it('should be able to get a specific meal from a user', async () => {
    const createUserResponse = await request(app.server)
      .post('/signup')
      .send(user)
      .expect(201);

    await request(app.server)
      .post('/meals')
      .set('Authorization', `Bearer ${createUserResponse.body.token}`)
      .send(meal)
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
    expect(getMealResponse.body.meal.name).toBe(meal.name);
  });

  it('should be able to modify all data for a registered meal from a user', async () => {
    const createUserResponse = await request(app.server)
      .post('/signup')
      .send(user)
      .expect(201);

    await request(app.server)
      .post('/meals')
      .set('Authorization', `Bearer ${createUserResponse.body.token}`)
      .send(meal)
      .expect(201);

    const listMealsResponse = await request(app.server)
      .get('/meals')
      .set('Authorization', `Bearer ${createUserResponse.body.token}`)
      .expect(200);

    const mealId = listMealsResponse.body.meals[0].id;

    await request(app.server)
      .put(`/meals/${mealId}`)
      .set('Authorization', `Bearer ${createUserResponse.body.token}`)
      .send(meal2)
      .expect(204);
  });

  it('should be able to delete a meal from a user', async () => {
    const createUserResponse = await request(app.server)
      .post('/signup')
      .send(user)
      .expect(201);

    await request(app.server)
      .post('/meals')
      .set('Authorization', `Bearer ${createUserResponse.body.token}`)
      .send(meal)
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
