import { describe, test, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../app.js';
import { resetDb } from './helpers/resetDb.js';

async function registerAndLogin(app: any, email = 'testuser@example.com', username = 'testuser') {
  await request(app).post('/auth/register').send({
    email,
    username,
    password: 'Test1234!'
  });
  const loginResponse = await request(app).post('/auth/login').send({
    email,
    password: 'Test1234!'
  });
  return loginResponse.headers['set-cookie'];
}

async function createChallenge(app: any, cookie: string[]) {
  const response = await request(app)
    .post('/challenges')
    .set('Cookie', cookie)
    .send({
      title: 'Hollow Knight - No Damage',
      scoreFormat: 'SCORE',
      description: 'Complete without damage',
      gameId: 22321,
      gameTitle: 'Hollow Knight',
      gameSlug: 'hollow-knight',
      gameImageUrl: 'https://example.com/hollow-knight.jpg'
    });
  return response.body.challenge.id;
}

describe('Reports routes', () => {
  beforeEach(async () => {
    // Arrange (partagé) : base vide avant chaque test
    await resetDb();
  });

  describe('POST /reports', () => {
    test('When reporting an existing challenge with a valid reason, returns 201', async () => {
      // Arrange
      const cookie = await registerAndLogin(app);
      const challengeId = await createChallenge(app, cookie);

      // Act
      const response = await request(app)
        .post('/reports')
        .set('Cookie', cookie)
        .send({
          targetType: 'CHALLENGE',
          targetId: challengeId,
          reason: 'This challenge contains inappropriate content.'
        });

      // Assert
      expect(response.status).toBe(201);
    });

    test('When reporting the same content twice, returns 400', async () => {
      // Arrange
      const cookie = await registerAndLogin(app);
      const challengeId = await createChallenge(app, cookie);
      await request(app)
        .post('/reports')
        .set('Cookie', cookie)
        .send({
          targetType: 'CHALLENGE',
          targetId: challengeId,
          reason: 'This challenge contains inappropriate content.'
        });

      // Act
      const response = await request(app)
        .post('/reports')
        .set('Cookie', cookie)
        .send({
          targetType: 'CHALLENGE',
          targetId: challengeId,
          reason: 'Second report, should not go through.'
        });

      // Assert
      expect(response.status).toBe(400);
    });

    test('When the reported challenge does not exist, returns 404', async () => {
      // Arrange
      const cookie = await registerAndLogin(app);

      // Act
      const response = await request(app)
        .post('/reports')
        .set('Cookie', cookie)
        .send({
          targetType: 'CHALLENGE',
          targetId: 'non-existent-id',
          reason: 'Reporting something that does not exist.'
        });

      // Assert
      expect(response.status).toBe(404);
    });

    test('When targetType is invalid, returns 400', async () => {
      // Arrange
      const cookie = await registerAndLogin(app);
      const challengeId = await createChallenge(app, cookie);

      // Act
      const response = await request(app)
        .post('/reports')
        .set('Cookie', cookie)
        .send({
          targetType: 'INVALID_TYPE',
          targetId: challengeId,
          reason: 'This should fail validation.'
        });

      // Assert
      expect(response.status).toBe(400);
    });

    test('When reason is too short, returns 400', async () => {
      // Arrange
      const cookie = await registerAndLogin(app);
      const challengeId = await createChallenge(app, cookie);

      // Act
      const response = await request(app)
        .post('/reports')
        .set('Cookie', cookie)
        .send({
          targetType: 'CHALLENGE',
          targetId: challengeId,
          reason: 'Short'
        });

      // Assert
      expect(response.status).toBe(400);
    });

    test('When user is not authenticated, returns 401', async () => {
      // Arrange
      const cookie = await registerAndLogin(app);
      const challengeId = await createChallenge(app, cookie);

      // Act
      const response = await request(app).post('/reports').send({
        targetType: 'CHALLENGE',
        targetId: challengeId,
        reason: 'Anonymous report attempt.'
      });

      // Assert
      expect(response.status).toBe(401);
    });
  });
});