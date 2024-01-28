import request from 'supertest';
import { beforeAll, describe, it } from 'vitest';
import { app } from '../src/app';

describe('API Service', () => {
  beforeAll(async () => {
    await app.ready();
  });

  it('should be able to get a 404 not found error when accessing a non-existent route', async () => {
    await request(app.server).get('/any-route').expect(404);
  });
});
