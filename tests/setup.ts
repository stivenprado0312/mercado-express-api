import dotenv from 'dotenv';

dotenv.config({ path: '.env.test' });

beforeAll(() => {
  process.env.NODE_ENV = 'test';
});

afterAll(() => {
  jest.clearAllMocks();
});
