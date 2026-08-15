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

describe('Participations routes', () => {
  beforeEach(async () => {
    await resetDb();
  });

  describe('POST /participation/challenges/:id/participations', () => {
    test('When submissionUrl and description are valid, returns 201', async () => {
      const cookie = await registerAndLogin(app);
      const challengeId = await createChallenge(app, cookie);

      const response = await request(app)
        .post(`/participation/challenges/${challengeId}/participations`)
        .set('Cookie', cookie)
        .send({ submissionUrl: 'https://youtube.com/watch?v=abc', description: 'My run' });

      expect(response.status).toBe(201);
    });

    test('When the challenge does not exist, returns 404', async () => {
      const cookie = await registerAndLogin(app);

      const response = await request(app)
        .post('/participation/challenges/non-existent-id/participations')
        .set('Cookie', cookie)
        .send({ submissionUrl: 'https://youtube.com/watch?v=abc' });

      expect(response.status).toBe(404);
    });

    test('When submissionUrl is not a valid URL, returns 400', async () => {
      const cookie = await registerAndLogin(app);
      const challengeId = await createChallenge(app, cookie);

      const response = await request(app)
        .post(`/participation/challenges/${challengeId}/participations`)
        .set('Cookie', cookie)
        .send({ submissionUrl: 'not-a-url' });

      expect(response.status).toBe(400);
    });

    test('When user is not authenticated, returns 401', async () => {
      const cookie = await registerAndLogin(app);
      const challengeId = await createChallenge(app, cookie);

      const response = await request(app)
        .post(`/participation/challenges/${challengeId}/participations`)
        .send({ submissionUrl: 'https://youtube.com/watch?v=abc' });

      expect(response.status).toBe(401);
    });
  });

  describe('PATCH /participation/participations/:id', () => {
    test('When the owner updates their participation, returns 200', async () => {
      const cookie = await registerAndLogin(app);
      const challengeId = await createChallenge(app, cookie);
      const created = await request(app)
        .post(`/participation/challenges/${challengeId}/participations`)
        .set('Cookie', cookie)
        .send({ submissionUrl: 'https://youtube.com/watch?v=abc' });

      const response = await request(app)
        .patch(`/participation/participations/${created.body.participation.id}`)
        .set('Cookie', cookie)
        .send({ description: 'Updated description' });

      expect(response.status).toBe(200);
      expect(response.body.participation.description).toBe('Updated description');
    });

    test('When a different user tries to update, returns 403', async () => {
      const ownerCookie = await registerAndLogin(app, 'owner@example.com', 'owner');
      const challengeId = await createChallenge(app, ownerCookie);
      const created = await request(app)
        .post(`/participation/challenges/${challengeId}/participations`)
        .set('Cookie', ownerCookie)
        .send({ submissionUrl: 'https://youtube.com/watch?v=abc' });
      const otherCookie = await registerAndLogin(app, 'other@example.com', 'other');

      const response = await request(app)
        .patch(`/participation/participations/${created.body.participation.id}`)
        .set('Cookie', otherCookie)
        .send({ description: 'Hacked' });

      expect(response.status).toBe(403);
    });

    test('When the participation does not exist, returns 404', async () => {
      const cookie = await registerAndLogin(app);

      const response = await request(app)
        .patch('/participation/participations/non-existent-id')
        .set('Cookie', cookie)
        .send({ description: 'Updated' });

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /participation/participations/:id', () => {
    test('When the owner deletes their participation, returns 204', async () => {
      const cookie = await registerAndLogin(app);
      const challengeId = await createChallenge(app, cookie);
      const created = await request(app)
        .post(`/participation/challenges/${challengeId}/participations`)
        .set('Cookie', cookie)
        .send({ submissionUrl: 'https://youtube.com/watch?v=abc' });

      const response = await request(app)
        .delete(`/participation/participations/${created.body.participation.id}`)
        .set('Cookie', cookie);

      expect(response.status).toBe(204);
    });

    test('When a different user tries to delete, returns 403', async () => {
      const ownerCookie = await registerAndLogin(app, 'owner@example.com', 'owner');
      const challengeId = await createChallenge(app, ownerCookie);
      const created = await request(app)
        .post(`/participation/challenges/${challengeId}/participations`)
        .set('Cookie', ownerCookie)
        .send({ submissionUrl: 'https://youtube.com/watch?v=abc' });
      const otherCookie = await registerAndLogin(app, 'other@example.com', 'other');

      const response = await request(app)
        .delete(`/participation/participations/${created.body.participation.id}`)
        .set('Cookie', otherCookie);

      expect(response.status).toBe(403);
    });
  });

  describe('POST /challengeVote/challenges/:id/vote', () => {
    test('When voting for the first time, returns 201', async () => {
      const cookie = await registerAndLogin(app);
      const challengeId = await createChallenge(app, cookie);

      const response = await request(app)
        .post(`/challengeVote/challenges/${challengeId}/vote`)
        .set('Cookie', cookie);

      expect(response.status).toBe(201);
    });

    test('When voting twice for the same challenge, returns 409', async () => {
      const cookie = await registerAndLogin(app);
      const challengeId = await createChallenge(app, cookie);
      await request(app).post(`/challengeVote/challenges/${challengeId}/vote`).set('Cookie', cookie);

      const response = await request(app)
        .post(`/challengeVote/challenges/${challengeId}/vote`)
        .set('Cookie', cookie);

      expect(response.status).toBe(409);
    });

    test('When the challenge does not exist, returns 404', async () => {
      const cookie = await registerAndLogin(app);

      const response = await request(app)
        .post('/challengeVote/challenges/non-existent-id/vote')
        .set('Cookie', cookie);

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /challengeVote/challenges/:id/vote', () => {
    test('When unvoting an existing vote, returns 204', async () => {
      const cookie = await registerAndLogin(app);
      const challengeId = await createChallenge(app, cookie);
      await request(app).post(`/challengeVote/challenges/${challengeId}/vote`).set('Cookie', cookie);

      const response = await request(app)
        .delete(`/challengeVote/challenges/${challengeId}/vote`)
        .set('Cookie', cookie);

      expect(response.status).toBe(204);
    });

    test('When there is no existing vote to remove, returns 404', async () => {
      const cookie = await registerAndLogin(app);
      const challengeId = await createChallenge(app, cookie);

      const response = await request(app)
        .delete(`/challengeVote/challenges/${challengeId}/vote`)
        .set('Cookie', cookie);

      expect(response.status).toBe(404);
    });
  });

  describe('POST /participationVote/participations/:id/vote', () => {
    test('When voting for the first time, returns 201', async () => {
      const cookie = await registerAndLogin(app);
      const challengeId = await createChallenge(app, cookie);
      const created = await request(app)
        .post(`/participation/challenges/${challengeId}/participations`)
        .set('Cookie', cookie)
        .send({ submissionUrl: 'https://youtube.com/watch?v=abc' });

      const response = await request(app)
        .post(`/participationVote/participations/${created.body.participation.id}/vote`)
        .set('Cookie', cookie);

      expect(response.status).toBe(201);
    });

    test('When voting twice for the same participation, returns 409', async () => {
      const cookie = await registerAndLogin(app);
      const challengeId = await createChallenge(app, cookie);
      const created = await request(app)
        .post(`/participation/challenges/${challengeId}/participations`)
        .set('Cookie', cookie)
        .send({ submissionUrl: 'https://youtube.com/watch?v=abc' });
      await request(app)
        .post(`/participationVote/participations/${created.body.participation.id}/vote`)
        .set('Cookie', cookie);

      const response = await request(app)
        .post(`/participationVote/participations/${created.body.participation.id}/vote`)
        .set('Cookie', cookie);

      expect(response.status).toBe(409);
    });
  });

  describe('DELETE /participationVote/participations/:id/vote', () => {
    test('When unvoting an existing vote, returns 204', async () => {
      const cookie = await registerAndLogin(app);
      const challengeId = await createChallenge(app, cookie);
      const created = await request(app)
        .post(`/participation/challenges/${challengeId}/participations`)
        .set('Cookie', cookie)
        .send({ submissionUrl: 'https://youtube.com/watch?v=abc' });
      await request(app)
        .post(`/participationVote/participations/${created.body.participation.id}/vote`)
        .set('Cookie', cookie);

      const response = await request(app)
        .delete(`/participationVote/participations/${created.body.participation.id}/vote`)
        .set('Cookie', cookie);

      expect(response.status).toBe(204);
    });

    test('When there is no existing vote to remove, returns 404', async () => {
      const cookie = await registerAndLogin(app);
      const challengeId = await createChallenge(app, cookie);
      const created = await request(app)
        .post(`/participation/challenges/${challengeId}/participations`)
        .set('Cookie', cookie)
        .send({ submissionUrl: 'https://youtube.com/watch?v=abc' });

      const response = await request(app)
        .delete(`/participationVote/participations/${created.body.participation.id}/vote`)
        .set('Cookie', cookie);

      expect(response.status).toBe(404);
    });
  });
});