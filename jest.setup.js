// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import 'whatwg-fetch'; 

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    query: {},
    asPath: '/',
    pathname: '/',
  }),
}));

// Mock next-auth
jest.mock('next-auth/react', () => {
  const originalModule = jest.requireActual('next-auth/react');
  return {
    __esModule: true,
    ...originalModule,
    signIn: jest.fn(),
    signOut: jest.fn(),
    useSession: jest.fn(() => ({
      data: null,
      status: 'unauthenticated',
    })),
  };
});

// Mock Prisma
jest.mock('@prisma/client', () => {
  const { PrismaClient } = jest.requireActual('@prisma/client');
  return {
    PrismaClient: jest.fn().mockImplementation(() => ({
      $connect: jest.fn(),
      $disconnect: jest.fn(),
      product: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        count: jest.fn(),
      },
      category: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
      },
      // Add other models as needed
    })),
  };
});

// Reset mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
});

beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});