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

describe('Profile routes', () => {
  beforeEach(async () => {
    // Arrange (partagé) : base vide avant chaque test
    await resetDb();
  });

  describe('GET /profile', () => {
    test('When user is authenticated, returns 200 with user, stats, challenges and participations', async () => {
      // Arrange
      const cookie = await registerAndLogin(app);

      // Act
      const response = await request(app).get('/profile').set('Cookie', cookie);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.user.username).toBe('testuser');
      expect(response.body.stats).toHaveProperty('totalChallenges', 0);
      expect(response.body.challenges).toEqual([]);
      expect(response.body.participations).toEqual([]);
    });

    test('When user is not authenticated, returns 401', async () => {
      // Act
      const response = await request(app).get('/profile');

      // Assert
      expect(response.status).toBe(401);
    });
  });

  describe('PATCH /profile', () => {
    test('When updating username only with a valid value, returns 200 with the new username', async () => {
      // Arrange
      const cookie = await registerAndLogin(app);

      // Act
      const response = await request(app)
        .patch('/profile')
        .set('Cookie', cookie)
        .send({ username: 'newusername' });

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.user.username).toBe('newusername');
    });

    test('When updating email and password, returns 200 and the new password works on next login', async () => {
      // Arrange
      const cookie = await registerAndLogin(app);

      // Act
      const updateResponse = await request(app)
        .patch('/profile')
        .set('Cookie', cookie)
        .send({ email: 'newemail@example.com', password: 'NewPassword123!' });
      const loginResponse = await request(app).post('/auth/login').send({
        email: 'newemail@example.com',
        password: 'NewPassword123!'
      });

      // Assert
      expect(updateResponse.status).toBe(200);
      expect(updateResponse.body.user.email).toBe('newemail@example.com');
      expect(loginResponse.status).toBe(200);
    });

    test('When the new username is already taken by another user, returns 409', async () => {
      // Arrange
      await registerAndLogin(app, 'other@example.com', 'takenusername');
      const cookie = await registerAndLogin(app, 'testuser@example.com', 'testuser');

      // Act
      const response = await request(app)
        .patch('/profile')
        .set('Cookie', cookie)
        .send({ username: 'takenusername' });

      // Assert
      expect(response.status).toBe(409);
    });

    test('When the new email is already taken by another user, returns 409', async () => {
      // Arrange
      await registerAndLogin(app, 'taken@example.com', 'otheruser');
      const cookie = await registerAndLogin(app, 'testuser@example.com', 'testuser');

      // Act
      const response = await request(app)
        .patch('/profile')
        .set('Cookie', cookie)
        .send({ email: 'taken@example.com' });

      // Assert
      expect(response.status).toBe(409);
    });

    test('When email format is invalid, returns 400', async () => {
      // Arrange
      const cookie = await registerAndLogin(app);

      // Act
      const response = await request(app)
        .patch('/profile')
        .set('Cookie', cookie)
        .send({ email: 'not-an-email' });

      // Assert
      expect(response.status).toBe(400);
    });

    test('When username is too short, returns 400', async () => {
      // Arrange
      const cookie = await registerAndLogin(app);

      // Act
      const response = await request(app)
        .patch('/profile')
        .set('Cookie', cookie)
        .send({ username: 'ab' });

      // Assert
      expect(response.status).toBe(400);
    });

    test('When password lacks an uppercase letter and special character, returns 400', async () => {
      // Arrange
      const cookie = await registerAndLogin(app);

      // Act
      const response = await request(app)
        .patch('/profile')
        .set('Cookie', cookie)
        .send({ password: 'weakpassword' });

      // Assert
      expect(response.status).toBe(400);
    });

    test('When the payload contains an unknown field, returns 400', async () => {
      // Arrange
      const cookie = await registerAndLogin(app);

      // Act
      const response = await request(app)
        .patch('/profile')
        .set('Cookie', cookie)
        .send({ role: 'admin' });

      // Assert
      expect(response.status).toBe(400);
    });

    test('When user is not authenticated, returns 401', async () => {
      // Act
      const response = await request(app).patch('/profile').send({ username: 'hacker' });

      // Assert
      expect(response.status).toBe(401);
    });
  });

  describe('DELETE /profile', () => {
    test('When user is authenticated, returns 204 and anonymizes the account', async () => {
      // Arrange
      const cookie = await registerAndLogin(app);

      // Act
      const response = await request(app).delete('/profile').set('Cookie', cookie);

      // Assert : le compte est anonymisé, l'ancien email ne permet plus de se connecter
      expect(response.status).toBe(204);
      const loginAttempt = await request(app).post('/auth/login').send({
        email: 'testuser@example.com',
        password: 'Test1234!'
      });
      expect(loginAttempt.status).toBe(401);
    });

    test('When user is not authenticated, returns 401', async () => {
      // Act
      const response = await request(app).delete('/profile');

      // Assert
      expect(response.status).toBe(401);
    });
  });
});