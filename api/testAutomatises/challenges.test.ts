import { describe, test, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../app.js';
import { resetDb } from './helpers/resetDb.js';

// Petits helpers locaux : évitent de répéter register+login dans chaque test
async function registerAndLogin(app: any, email = 'creator@example.com') {
  await request(app).post('/auth/register').send({
    email,
    username: email.split('@')[0],
    password: 'Test1234!'
  });
  const loginResponse = await request(app).post('/auth/login').send({
    email,
    password: 'Test1234!'
  });
  return loginResponse.headers['set-cookie'];
}

const validChallenge = {
  title: 'Hollow Knight - No Damage',
  scoreFormat: 'SCORE',
  description: 'Complete without damage',
  gameId: 22321,
  gameTitle: 'Hollow Knight',
  gameSlug: 'hollow-knight',
  gameImageUrl: 'https://example.com/hollow-knight.jpg'
};

describe('Challenges routes', () => {
  beforeEach(async () => {
    // Arrange (partagé) : base vide avant chaque test
    await resetDb();
  });

  describe('POST /challenges', () => {
    test('When all required fields are provided and user is authenticated, returns 201', async () => {
      // Arrange
      const cookie = await registerAndLogin(app);

      // Act
      const response = await request(app)
        .post('/challenges')
        .set('Cookie', cookie)
        .send(validChallenge);

      // Assert
      expect(response.status).toBe(201);
      expect(response.body.challenge.title).toBe(validChallenge.title);
    });

    test('When gameId is missing, returns 400', async () => {
      // Arrange
      const cookie = await registerAndLogin(app);
      const { gameId, ...incomplete } = validChallenge;

      // Act
      const response = await request(app)
        .post('/challenges')
        .set('Cookie', cookie)
        .send(incomplete);

      // Assert
      expect(response.status).toBe(400);
    });

    test('When gameTitle is missing, returns 400', async () => {
      // Arrange
      const cookie = await registerAndLogin(app);
      const { gameTitle, ...incomplete } = validChallenge;

      // Act
      const response = await request(app)
        .post('/challenges')
        .set('Cookie', cookie)
        .send(incomplete);

      // Assert
      expect(response.status).toBe(400);
    });

    test('When gameSlug is missing, returns 400', async () => {
      // Arrange
      const cookie = await registerAndLogin(app);
      const { gameSlug, ...incomplete } = validChallenge;

      // Act
      const response = await request(app)
        .post('/challenges')
        .set('Cookie', cookie)
        .send(incomplete);

      // Assert
      expect(response.status).toBe(400);
    });

    test('When user is not authenticated, returns 401', async () => {
      // Act
      const response = await request(app).post('/challenges').send(validChallenge);

      // Assert
      expect(response.status).toBe(401);
    });

    test('When a challenge with the same title already exists, returns 409', async () => {
      // Arrange
      const cookie = await registerAndLogin(app);
      await request(app).post('/challenges').set('Cookie', cookie).send(validChallenge);

      // Act : on retente avec exactement le même titre
      const response = await request(app)
        .post('/challenges')
        .set('Cookie', cookie)
        .send(validChallenge);

      // Assert
      expect(response.status).toBe(409);
    });
  });

  describe('GET /challenges', () => {
    test('When challenges exist, returns 200 with a list including voteCount', async () => {
      // Arrange
      const cookie = await registerAndLogin(app);
      await request(app).post('/challenges').set('Cookie', cookie).send(validChallenge);

      // Act
      const response = await request(app).get('/challenges');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.challenges).toHaveLength(1);
      expect(response.body.challenges[0]).toHaveProperty('voteCount', 0);
    });
  });

  describe('GET /challenges/:slug', () => {
    test('When the slug exists, returns 200 with the challenge', async () => {
      // Arrange
      const cookie = await registerAndLogin(app);
      const created = await request(app)
        .post('/challenges')
        .set('Cookie', cookie)
        .send(validChallenge);

      // Act
      const response = await request(app).get(`/challenges/${created.body.challenge.slug}`);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.challenge.title).toBe(validChallenge.title);
    });

    test('When the slug does not exist, returns 404', async () => {
      // Act
      const response = await request(app).get('/challenges/does-not-exist');

      // Assert
      expect(response.status).toBe(404);
    });
  });

  describe('PATCH /challenges/:id', () => {
    test('When the creator updates their own challenge, returns 200', async () => {
      // Arrange
      const cookie = await registerAndLogin(app);
      const created = await request(app)
        .post('/challenges')
        .set('Cookie', cookie)
        .send(validChallenge);

      // Act
      const response = await request(app)
        .patch(`/challenges/${created.body.challenge.id}`)
        .set('Cookie', cookie)
        .send({ description: 'Updated description' });

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.challenge.description).toBe('Updated description');
    });

    test('When a different user tries to update, returns 403', async () => {
      // Arrange
      const creatorCookie = await registerAndLogin(app, 'creator@example.com');
      const created = await request(app)
        .post('/challenges')
        .set('Cookie', creatorCookie)
        .send(validChallenge);
      const otherCookie = await registerAndLogin(app, 'other@example.com');

      // Act
      const response = await request(app)
        .patch(`/challenges/${created.body.challenge.id}`)
        .set('Cookie', otherCookie)
        .send({ description: 'Hacked description' });

      // Assert
      expect(response.status).toBe(403);
    });

    test('When the challenge does not exist, returns 404', async () => {
      // Arrange
      const cookie = await registerAndLogin(app);

      // Act
      const response = await request(app)
        .patch('/challenges/non-existent-id')
        .set('Cookie', cookie)
        .send({ description: 'Updated' });

      // Assert
      expect(response.status).toBe(404);
    });

    test('When user is not authenticated, returns 401', async () => {
      // Act
      const response = await request(app)
        .patch('/challenges/some-id')
        .send({ description: 'Updated' });

      // Assert
      expect(response.status).toBe(401);
    });
  });

  describe('DELETE /challenges/:id', () => {
    test('When the creator deletes their own challenge, returns 204', async () => {
      // Arrange
      const cookie = await registerAndLogin(app);
      const created = await request(app)
        .post('/challenges')
        .set('Cookie', cookie)
        .send(validChallenge);

      // Act
      const response = await request(app)
        .delete(`/challenges/${created.body.challenge.id}`)
        .set('Cookie', cookie);

      // Assert
      expect(response.status).toBe(204);
    });

    test('When a different user tries to delete, returns 403', async () => {
      // Arrange
      const creatorCookie = await registerAndLogin(app, 'creator@example.com');
      const created = await request(app)
        .post('/challenges')
        .set('Cookie', creatorCookie)
        .send(validChallenge);
      const otherCookie = await registerAndLogin(app, 'other@example.com');

      // Act
      const response = await request(app)
        .delete(`/challenges/${created.body.challenge.id}`)
        .set('Cookie', otherCookie);

      // Assert
      expect(response.status).toBe(403);
    });

    test('When the challenge does not exist, returns 404', async () => {
      // Arrange
      const cookie = await registerAndLogin(app);

      // Act
      const response = await request(app)
        .delete('/challenges/non-existent-id')
        .set('Cookie', cookie);

      // Assert
      expect(response.status).toBe(404);
    });

    test('When user is not authenticated, returns 401', async () => {
      // Act
      const response = await request(app).delete('/challenges/some-id');

      // Assert
      expect(response.status).toBe(401);
    });
  });
});