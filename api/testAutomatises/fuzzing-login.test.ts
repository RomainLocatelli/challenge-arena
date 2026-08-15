import { describe, test, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../app.js';
import { resetDb } from './helpers/resetDb.js';

describe('Fuzzing — POST /auth/login', () => {
  beforeEach(async () => {
    // Arrange (partagé) : base vide avant chaque test
    await resetDb();
  });

  test('When email and password are empty strings, returns 400', async () => {
    // Act
    const response = await request(app).post('/auth/login').send({ email: '', password: '' });

    // Assert
    expect(response.status).toBe(400);
  });

  test('When the body is an empty object, returns 400', async () => {
    // Act
    const response = await request(app).post('/auth/login').send({});

    // Assert
    expect(response.status).toBe(400);
  });

  test('When email and password are null, returns 400', async () => {
    // Act
    const response = await request(app).post('/auth/login').send({ email: null, password: null });

    // Assert
    expect(response.status).toBe(400);
  });

  test('When email and password have wrong types, returns 400', async () => {
    // Act
    const response = await request(app).post('/auth/login').send({ email: 12345, password: true });

    // Assert
    expect(response.status).toBe(400);
  });

  test('When attempting classic SQL injection, returns 400 and does not bypass authentication', async () => {
    // Act
    const response = await request(app)
      .post('/auth/login')
      .send({ email: "' OR '1'='1", password: "' OR '1'='1" });

    // Assert
    expect(response.status).toBe(400);
  });

  test('When attempting SQL injection with a comment, returns 400 and does not bypass authentication', async () => {
    // Act
    const response = await request(app)
      .post('/auth/login')
      .send({ email: "admin@test.com'--", password: 'whatever' });

    // Assert
    expect(response.status).toBe(400);
  });

  test('When email is syntactically valid but extremely long, returns 401 (not 500)', async () => {
    // Arrange
    const longEmail = `${'a'.repeat(200)}@test.com`;

    // Act
    const response = await request(app)
      .post('/auth/login')
      .send({ email: longEmail, password: 'b'.repeat(200) });

    // Assert : pas de credentials existants pour cet email, donc 401 attendu, jamais 500
    expect(response.status).toBe(401);
  });

  test('When email and password contain unicode/emoji characters, returns 400 (not 500)', async () => {
    // Act
    const response = await request(app)
      .post('/auth/login')
      .send({ email: 'test🔥@💀.com', password: 'パスワード123!@#$%^&*()' });

    // Assert
    expect(response.status).toBe(400);
  });

  test('When attempting XSS in the email field, returns 400 (not 500)', async () => {
    // Act
    const response = await request(app)
      .post('/auth/login')
      .send({ email: "<script>alert('xss')</script>", password: 'test1234' });

    // Assert
    expect(response.status).toBe(400);
  });

  test('When the JSON body is malformed, returns 400', async () => {
    // Act
    const response = await request(app)
      .post('/auth/login')
      .set('Content-Type', 'application/json')
      .send('{ "email": "test@test.com" "password": "test1234" }');

    // Assert
    expect(response.status).toBe(400);
  });

  test('When Content-Type is text/plain instead of JSON, returns 400', async () => {
    // Act
    const response = await request(app)
      .post('/auth/login')
      .set('Content-Type', 'text/plain')
      .send('email=test@test.com&password=test1234');

    // Assert
    expect(response.status).toBe(400);
  });

  test('When the body is an array instead of an object, returns 400 (not 500)', async () => {
    // Act
    const response = await request(app).post('/auth/login').send(['email', 'password']);

    // Assert
    expect(response.status).toBe(400);
  });
});