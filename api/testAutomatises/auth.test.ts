import { describe, test, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../app.js';
import { resetDb } from './helpers/resetDb.js';

describe('Auth routes', () => {
  beforeEach(async () => {
    // Arrange (partagé) : base vide avant chaque test
    await resetDb();
  });

  describe('POST /auth/register', () => {
    test('When email, username and password are valid, returns 201', async () => {
      // Act
      const response = await request(app).post('/auth/register').send({
        email: 'testuser@example.com',
        username: 'testuser',
        password: 'Test1234!'
      });

      // Assert
      expect(response.status).toBe(201);
    });
  });

  describe('POST /auth/login', () => {
    test('When credentials are valid, returns 200 and sets a cookie', async () => {
      // Arrange
      await request(app).post('/auth/register').send({
        email: 'testuser@example.com',
        username: 'testuser',
        password: 'Test1234!'
      });

      // Act
      const response = await request(app).post('/auth/login').send({
        email: 'testuser@example.com',
        password: 'Test1234!'
      });

      // Assert
      expect(response.status).toBe(200);
      expect(response.headers['set-cookie']).toBeDefined();
    });

    test('When email does not exist, returns 401', async () => {
      // Act
      const response = await request(app).post('/auth/login').send({
        email: 'email_inexistant@example.com',
        password: 'Test1234!'
      });

      // Assert
      expect(response.status).toBe(401);
    });

    test('When body is malformed JSON, returns 400', async () => {
      // Act
      const response = await request(app)
        .post('/auth/login')
        .set('Content-Type', 'application/json')
        .send('{ "email": "test@test.com" "password": "test" }');

      // Assert
      expect(response.status).toBe(400);
    });
  });

  describe('GET /auth/me', () => {
    test('When cookie is valid, returns 200', async () => {
      // Arrange
      await request(app).post('/auth/register').send({
        email: 'testuser@example.com',
        username: 'testuser',
        password: 'Test1234!'
      });
      const loginResponse = await request(app).post('/auth/login').send({
        email: 'testuser@example.com',
        password: 'Test1234!'
      });
      const cookie = loginResponse.headers['set-cookie'];

      // Act
      const response = await request(app).get('/auth/me').set('Cookie', cookie);

      // Assert
      expect(response.status).toBe(200);
    });

    test('When no cookie is provided, returns 401', async () => {
      // Act
      const response = await request(app).get('/auth/me');

      // Assert
      expect(response.status).toBe(401);
    });
  });
});