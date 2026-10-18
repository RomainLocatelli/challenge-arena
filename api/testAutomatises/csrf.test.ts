import { describe, test, expect } from 'vitest';
import express from 'express';
import request from 'supertest';
import { csrfProtection } from '../src/middlewares/csrf.js';
import { errorHandler } from '../src/middlewares/errorHandler.js';
import app from '../app.js';

const FRONT = 'https://front.example.com';

// Mini-application de test : uniquement le middleware CSRF,
// une route GET, une route POST, et le gestionnaire d'erreurs du projet
const testApp = express();
testApp.use(csrfProtection(FRONT));
testApp.get('/test', (_req, res) => res.json({ ok: true }));
testApp.post('/test', (_req, res) => res.json({ ok: true }));
testApp.use(errorHandler);

describe('CSRF protection middleware', () => {
  test('When a GET request comes from another site, returns 200 (safe method)', async () => {
    // Act
    const response = await request(testApp).get('/test').set('Origin', 'https://evil.example.com');

    // Assert
    expect(response.status).toBe(200);
  });

  test('When a POST request has no Origin (curl, Postman), returns 200', async () => {
    // Act
    const response = await request(testApp).post('/test');

    // Assert
    expect(response.status).toBe(200);
  });

  test('When a POST request comes from the front-end, returns 200', async () => {
    // Act
    const response = await request(testApp).post('/test').set('Origin', FRONT);

    // Assert
    expect(response.status).toBe(200);
  });

  test('When a POST request comes from another site, returns 403', async () => {
    // Act
    const response = await request(testApp).post('/test').set('Origin', 'https://evil.example.com');

    // Assert
    expect(response.status).toBe(403);
    expect(response.body.message).toBe('Origine de la requête non autorisée');
  });

  test('When the Origin is "null" (sandboxed iframe), returns 403', async () => {
    // Act
    const response = await request(testApp).post('/test').set('Origin', 'null');

    // Assert
    expect(response.status).toBe(403);
  });

  test('When only a foreign Referer is sent, returns 403', async () => {
    // Act
    const response = await request(testApp)
      .post('/test')
      .set('Referer', 'https://evil.example.com/page');

    // Assert
    expect(response.status).toBe(403);
  });

  test('When only a Referer from the front-end is sent, returns 200', async () => {
    // Act
    const response = await request(testApp).post('/test').set('Referer', `${FRONT}/challenges/42`);

    // Assert
    expect(response.status).toBe(200);
  });
});

describe('CSRF protection on the real API', () => {
  test('When a login request comes from another site, returns 403 before reaching the controller', async () => {
    // Act
    const response = await request(app)
      .post('/auth/login')
      .set('Origin', 'https://evil.example.com')
      .send({ email: 'victim@example.com', password: 'Test1234!' });

    // Assert
    expect(response.status).toBe(403);
  });
});
