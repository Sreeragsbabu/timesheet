const request = require('supertest');
const express = require('express');
const RegisterController = require('../../../src/routes/auth/register');
const UserService = require('../../../src/services/User');

// Mock the UserService
jest.mock('../../../src/services/User');

// Create a test Express app
const app = express();
app.use(express.json());
app.post('/register', RegisterController);

describe('Register Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const validPayload = {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'Password@123',
    role: 'admin',
    empId: 'EMP001'
  };

  describe('POST /register', () => {
    test('should register user successfully with valid data', async () => {
      const mockUser = { 
        _id: '123', 
        name: validPayload.name,
        email: validPayload.email,
        role: validPayload.role,
        empId: validPayload.empId,
        passwordHash: 'hashedPassword' 
      };
      
      UserService.createUser.mockResolvedValue(mockUser);

      const response = await request(app)
        .post('/register')
        .send(validPayload)
        .expect(200);

      expect(response.body).toHaveProperty('savedUser');
      expect(response.body.savedUser).toEqual(mockUser);
      expect(UserService.createUser).toHaveBeenCalledWith(validPayload);
      expect(UserService.createUser).toHaveBeenCalledTimes(1);
    });

    test('should return 400 if validation fails - invalid email', async () => {
      const invalidPayload = { 
        ...validPayload, 
        email: 'invalid-email' 
      };

      const response = await request(app)
        .post('/register')
        .send(invalidPayload)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(typeof response.body.error).toBe('string');
      expect(UserService.createUser).not.toHaveBeenCalled();
    });

    test('should return 400 if name is missing', async () => {
      const { name, ...payloadWithoutName } = validPayload;

      const response = await request(app)
        .post('/register')
        .send(payloadWithoutName)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(UserService.createUser).not.toHaveBeenCalled();
    });

    test('should return 400 if email is missing', async () => {
      const { email, ...payloadWithoutEmail } = validPayload;

      const response = await request(app)
        .post('/register')
        .send(payloadWithoutEmail)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(UserService.createUser).not.toHaveBeenCalled();
    });

    test('should return 400 if password is missing', async () => {
      const { password, ...payloadWithoutPassword } = validPayload;

      const response = await request(app)
        .post('/register')
        .send(payloadWithoutPassword)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(UserService.createUser).not.toHaveBeenCalled();
    });

    test('should return 500 when user already exists', async () => {
      UserService.createUser.mockRejectedValue(
        new Error('User already exists')
      );

      const response = await request(app)
        .post('/register')
        .send(validPayload)
        .expect(500);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('User already exists');
    });

    test('should return 500 for database errors', async () => {
      UserService.createUser.mockRejectedValue(
        new Error('Database connection failed')
      );

      const response = await request(app)
        .post('/register')
        .send(validPayload)
        .expect(500);

      expect(response.body.error).toBe('Database connection failed');
    });

    test('should return 500 for unexpected errors', async () => {
      UserService.createUser.mockRejectedValue(
        new Error('Unexpected error')
      );

      const response = await request(app)
        .post('/register')
        .send(validPayload)
        .expect(500);

      expect(response.body.error).toBe('Unexpected error');
    });

    test('should call validation schema with request body', async () => {
      UserService.createUser.mockResolvedValue({});

      await request(app)
        .post('/register')
        .send(validPayload);

      expect(UserService.createUser).toHaveBeenCalledWith(
        expect.objectContaining({
          name: validPayload.name,
          email: validPayload.email,
          password: validPayload.password
        })
      );
    });
  });
});