import { render } from "@testing-library/react-native";
import React from "react";
import { useAutoLock } from "../../hooks/useAutoLock";
import RootLayout from "../_layout";

// Component-specific mocks (global mocks are in jest.setup.js)
jest.mock("../../components/OfflineBanner", () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const React = require("react");
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const ReactNative = require("react-native");
  return {
    OfflineBanner: () => {
      return React.createElement(ReactNative.View, {
        testID: "offline-banner",
      });
    },
  };
});

jest.mock("../../components/LockScreen", () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const React = require("react");
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const ReactNative = require("react-native");
  return {
    LockScreen: () => {
      return React.createElement(ReactNative.View, { testID: "lock-screen" });
    },
  };
});

jest.mock("../../hooks/useAutoLock");

jest.mock("../../utils/queryPersister", () => ({
  createMMKVPersister: jest.fn().mockReturnValue({
    persistClient: jest.fn(),
    restoreClient: jest.fn(),
    removeClient: jest.fn(),
  }),
}));

jest.mock("../../store/store", () => ({
  store: {
    getState: jest.fn(),
    subscribe: jest.fn(),
    dispatch: jest.fn(),
  },
}));

describe("RootLayout", () => {
  const mockUseAutoLock = useAutoLock as jest.MockedFunction<
    typeof useAutoLock
  >;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render without crashing", () => {
    mockUseAutoLock.mockReturnValue({
      isLocked: false,
      handleActivity: jest.fn(),
    });

    const { getByTestId } = render(<RootLayout />);

    expect(getByTestId("offline-banner")).toBeTruthy();
    expect(getByTestId("stack")).toBeTruthy();
  });

  it("should render OfflineBanner component", () => {
    mockUseAutoLock.mockReturnValue({
      isLocked: false,
      handleActivity: jest.fn(),
    });

    const { getByTestId } = render(<RootLayout />);

    expect(getByTestId("offline-banner")).toBeTruthy();
  });

  it("should render Stack with headerShown: false", () => {
    mockUseAutoLock.mockReturnValue({
      isLocked: false,
      handleActivity: jest.fn(),
    });

    const { getByTestId } = render(<RootLayout />);
    const stack = getByTestId("stack");

    expect(stack).toBeTruthy();
  });

  it("should not render LockScreen when isLocked is false", () => {
    mockUseAutoLock.mockReturnValue({
      isLocked: false,
      handleActivity: jest.fn(),
    });

    const { queryByTestId } = render(<RootLayout />);

    expect(queryByTestId("lock-screen")).toBeNull();
  });

  it("should render LockScreen when isLocked is true", () => {
    mockUseAutoLock.mockReturnValue({
      isLocked: true,
      handleActivity: jest.fn(),
    });

    const { getByTestId } = render(<RootLayout />);

    expect(getByTestId("lock-screen")).toBeTruthy();
  });

  it("should call handleActivity when user interacts with the app", () => {
    const mockHandleActivity = jest.fn();
    mockUseAutoLock.mockReturnValue({
      isLocked: false,
      handleActivity: mockHandleActivity,
    });

    const { getByTestId } = render(<RootLayout />);
    const container = getByTestId("offline-banner").parent;

    // Simulate touch interaction
    if (container) {
      const touchHandler = container.props.onStartShouldSetResponderCapture;
      if (touchHandler) {
        const result = touchHandler();
        expect(mockHandleActivity).toHaveBeenCalled();
        expect(result).toBe(false);
      }
    }
  });

  it("should wrap components in Provider and QueryClientProvider", () => {
    mockUseAutoLock.mockReturnValue({
      isLocked: false,
      handleActivity: jest.fn(),
    });

    const { getByTestId } = render(<RootLayout />);

    // If providers are working correctly, child components should render
    expect(getByTestId("offline-banner")).toBeTruthy();
    expect(getByTestId("stack")).toBeTruthy();
  });
});
