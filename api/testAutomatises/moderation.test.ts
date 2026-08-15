import { describe, test, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../app.js';
import { prisma } from '../lib/prisma.js';
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

// Crée un user normal, le promeut ADMIN en base, puis se reloggue pour avoir un cookie à jour
async function registerAndLoginAsAdmin(app: any, email = 'admin@example.com', username = 'admin') {
  await registerAndLogin(app, email, username);
  await prisma.user.update({ where: { email }, data: { role: 'ADMIN' } });
  const loginResponse = await request(app).post('/auth/login').send({
    email,
    password: 'Test1234!'
  });
  return loginResponse.headers['set-cookie'];
}

async function createChallenge(app: any, cookie: string[], title = 'Hollow Knight - No Damage') {
  const response = await request(app)
    .post('/challenges')
    .set('Cookie', cookie)
    .send({
      title,
      scoreFormat: 'SCORE',
      description: 'Complete without damage',
      gameId: 22321,
      gameTitle: 'Hollow Knight',
      gameSlug: 'hollow-knight',
      gameImageUrl: 'https://example.com/hollow-knight.jpg'
    });
  return response.body.challenge.id;
}

async function reportChallenge(app: any, cookie: string[], challengeId: string) {
  return request(app)
    .post('/reports')
    .set('Cookie', cookie)
    .send({
      targetType: 'CHALLENGE',
      targetId: challengeId,
      reason: 'This challenge contains inappropriate content.'
    });
}

describe('Moderation routes', () => {
  beforeEach(async () => {
    // Arrange (partagé) : base vide avant chaque test
    await resetDb();
  });

  describe('GET /moderation/challenges', () => {
    test('When an admin requests reported challenges, returns 200 with the report details', async () => {
      // Arrange
      const userCookie = await registerAndLogin(app, 'reporter@example.com', 'reporter');
      const challengeId = await createChallenge(app, userCookie);
      await reportChallenge(app, userCookie, challengeId);
      const adminCookie = await registerAndLoginAsAdmin(app);

      // Act
      const response = await request(app).get('/moderation/challenges').set('Cookie', adminCookie);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.challenges).toHaveLength(1);
      expect(response.body.challenges[0].reportCount).toBe(1);
    });

    test('When a non-admin user requests reported challenges, returns 403', async () => {
      // Arrange
      const userCookie = await registerAndLogin(app);

      // Act
      const response = await request(app).get('/moderation/challenges').set('Cookie', userCookie);

      // Assert
      expect(response.status).toBe(403);
    });

    test('When no user is authenticated, returns 401', async () => {
      // Act
      const response = await request(app).get('/moderation/challenges');

      // Assert
      expect(response.status).toBe(401);
    });
  });

  describe('POST /moderation/approve', () => {
    test('When an admin approves a reported challenge, removes its reports', async () => {
      // Arrange
      const userCookie = await registerAndLogin(app, 'reporter@example.com', 'reporter');
      const challengeId = await createChallenge(app, userCookie);
      await reportChallenge(app, userCookie, challengeId);
      const adminCookie = await registerAndLoginAsAdmin(app);

      // Act
      const response = await request(app)
        .post('/moderation/approve')
        .set('Cookie', adminCookie)
        .send({ targetType: 'CHALLENGE', targetId: challengeId });

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.deletedReports).toBe(1);
    });

    test('When targetType is invalid, returns 400', async () => {
      // Arrange
      const adminCookie = await registerAndLoginAsAdmin(app);

      // Act
      const response = await request(app)
        .post('/moderation/approve')
        .set('Cookie', adminCookie)
        .send({ targetType: 'INVALID_TYPE', targetId: 'some-id' });

      // Assert
      expect(response.status).toBe(400);
    });

    test('When the target content does not exist, returns 404', async () => {
      // Arrange
      const adminCookie = await registerAndLoginAsAdmin(app);

      // Act
      const response = await request(app)
        .post('/moderation/approve')
        .set('Cookie', adminCookie)
        .send({ targetType: 'CHALLENGE', targetId: 'non-existent-id' });

      // Assert
      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /moderation/challenge/:id', () => {
    test('When an admin deletes a reported challenge, returns 200', async () => {
      // Arrange
      const userCookie = await registerAndLogin(app, 'reporter@example.com', 'reporter');
      const challengeId = await createChallenge(app, userCookie);
      await reportChallenge(app, userCookie, challengeId);
      const adminCookie = await registerAndLoginAsAdmin(app);

      // Act
      const response = await request(app)
        .delete(`/moderation/challenge/${challengeId}`)
        .set('Cookie', adminCookie);

      // Assert
      expect(response.status).toBe(200);
    });

    test('When a non-admin user tries to delete, returns 403', async () => {
      // Arrange
      const userCookie = await registerAndLogin(app, 'reporter@example.com', 'reporter');
      const challengeId = await createChallenge(app, userCookie);

      // Act
      const response = await request(app)
        .delete(`/moderation/challenge/${challengeId}`)
        .set('Cookie', userCookie);

      // Assert
      expect(response.status).toBe(403);
    });
  });

  describe('PATCH /moderation/users/:userId/ban', () => {
    test('When an admin bans a user, that user can no longer log in', async () => {
      // Arrange
      await registerAndLogin(app, 'charlie@example.com', 'charlie');
      const adminCookie = await registerAndLoginAsAdmin(app);
      const users = await request(app).get('/moderation/users').set('Cookie', adminCookie);
      const charlie = users.body.users.find((u: any) => u.email === 'charlie@example.com');

      // Act
      const banResponse = await request(app)
        .patch(`/moderation/users/${charlie.id}/ban`)
        .set('Cookie', adminCookie);
      const loginAttempt = await request(app).post('/auth/login').send({
        email: 'charlie@example.com',
        password: 'Test1234!'
      });

      // Assert
      expect(banResponse.status).toBe(200);
      expect(loginAttempt.status).toBe(403);
    });

    test('When trying to ban an already banned user, returns 400', async () => {
      // Arrange
      await registerAndLogin(app, 'charlie@example.com', 'charlie');
      const adminCookie = await registerAndLoginAsAdmin(app);
      const users = await request(app).get('/moderation/users').set('Cookie', adminCookie);
      const charlie = users.body.users.find((u: any) => u.email === 'charlie@example.com');
      await request(app).patch(`/moderation/users/${charlie.id}/ban`).set('Cookie', adminCookie);

      // Act
      const response = await request(app)
        .patch(`/moderation/users/${charlie.id}/ban`)
        .set('Cookie', adminCookie);

      // Assert
      expect(response.status).toBe(400);
    });

    test('When an admin tries to ban themselves, returns 400', async () => {
      // Arrange
      const adminCookie = await registerAndLoginAsAdmin(app);
      const users = await request(app).get('/moderation/users').set('Cookie', adminCookie);
      const admin = users.body.users.find((u: any) => u.email === 'admin@example.com');

      // Act
      const response = await request(app)
        .patch(`/moderation/users/${admin.id}/ban`)
        .set('Cookie', adminCookie);

      // Assert
      expect(response.status).toBe(400);
    });
  });

  describe('PATCH /moderation/users/:userId/unban', () => {
    test('When an admin unbans a banned user, that user can log in again', async () => {
      // Arrange
      await registerAndLogin(app, 'charlie@example.com', 'charlie');
      const adminCookie = await registerAndLoginAsAdmin(app);
      const users = await request(app).get('/moderation/users').set('Cookie', adminCookie);
      const charlie = users.body.users.find((u: any) => u.email === 'charlie@example.com');
      await request(app).patch(`/moderation/users/${charlie.id}/ban`).set('Cookie', adminCookie);

      // Act
      const unbanResponse = await request(app)
        .patch(`/moderation/users/${charlie.id}/unban`)
        .set('Cookie', adminCookie);
      const loginAttempt = await request(app).post('/auth/login').send({
        email: 'charlie@example.com',
        password: 'Test1234!'
      });

      // Assert
      expect(unbanResponse.status).toBe(200);
      expect(loginAttempt.status).toBe(200);
    });

    test('When trying to unban a user who is not banned, returns 400', async () => {
      // Arrange
      await registerAndLogin(app, 'charlie@example.com', 'charlie');
      const adminCookie = await registerAndLoginAsAdmin(app);
      const users = await request(app).get('/moderation/users').set('Cookie', adminCookie);
      const charlie = users.body.users.find((u: any) => u.email === 'charlie@example.com');

      // Act
      const response = await request(app)
        .patch(`/moderation/users/${charlie.id}/unban`)
        .set('Cookie', adminCookie);

      // Assert
      expect(response.status).toBe(400);
    });
  });
});