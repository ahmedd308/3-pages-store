// Global mocks for React Native components and libraries
// ESLint is disabled for this file (see eslint.config.js)

import type React from "react";

// Extend global type definitions
declare global {
  var mockQueryClientConstructor: jest.Mock;
  var mockPersistQueryClient: jest.Mock;
  var mockQueryClientInstance: {
    setDefaultOptions: jest.Mock;
    clear: jest.Mock;
  };
}

// Mock expo-router
jest.mock("expo-router", () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const React = require("react");
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const ReactNative = require("react-native");
  return {
    Stack: ({
      children,
      ...props
    }: {
      children: React.ReactNode;
      [key: string]: any;
    }) => {
      return React.createElement(
        ReactNative.View,
        { testID: "stack", ...props },
        children
      );
    },
    useRouter: () => ({
      push: jest.fn(),
      replace: jest.fn(),
      back: jest.fn(),
    }),
    useLocalSearchParams: () => ({}),
    usePathname: () => "/",
    useSegments: () => [],
  };
});

// Mock react-redux
jest.mock("react-redux", () => ({
  Provider: ({ children }: { children: React.ReactNode }) => children,
  useDispatch: () => jest.fn(),
  useSelector: jest.fn(),
}));

// Mock React Query
const mockQueryClientInstance = {
  setDefaultOptions: jest.fn(),
  clear: jest.fn(),
};

const mockQueryClientConstructor = jest.fn(() => mockQueryClientInstance);
const mockPersistQueryClient = jest.fn();

jest.mock("@tanstack/react-query", () => {
  return {
    QueryClient: mockQueryClientConstructor,
    QueryClientProvider: ({ children }: { children: React.ReactNode }) =>
      children,
    useQuery: jest.fn(),
    useMutation: jest.fn(),
    useQueryClient: () => mockQueryClientInstance,
  };
});

jest.mock("@tanstack/react-query-persist-client", () => {
  return {
    persistQueryClient: mockPersistQueryClient,
  };
});

// Make mock instances available globally for tests
global.mockQueryClientConstructor = mockQueryClientConstructor;
global.mockPersistQueryClient = mockPersistQueryClient;
global.mockQueryClientInstance = mockQueryClientInstance;
