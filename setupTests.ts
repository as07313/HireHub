import '@testing-library/jest-dom'
import { TextEncoder, TextDecoder } from 'util'
import { cleanup } from '@testing-library/react'

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      pathname: '/',
    }
  },
}))

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      pathname: '/',
    }
  },
  usePathname() {
    return '/'
  },
}))

// Mock localStorage
const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
    length: 0,
    key: jest.fn(),
  } as Storage;
  
  global.localStorage = localStorageMock

// Provide TextEncoder/TextDecoder for Node.js environment
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder as any

// Clean up after each test
afterEach(() => {
  cleanup()
  localStorage.clear()
  jest.clearAllMocks()
})