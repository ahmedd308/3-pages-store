# 🛍️ 3 Pages Store

![React Native](https://img.shields.io/badge/React_Native-0.81.4-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-blue)
![React Query](https://img.shields.io/badge/React_Query-5.90.5-green)
![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-2.9.0-purple)

A minimal yet powerful e-commerce application built with React Native that features authentication, biometric security, offline-first architecture, and product management capabilities powered by the DummyJSON API.

## 📋 Table of Contents

- [Features](#-features)
- [Technology Stack](#️-technology-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Configuration](#-app-configuration)
- [Testing](#-testing)
- [Trade-offs & Future Improvements](#%EF%B8%8F-trade-offs--future-improvements)
- [Author](#%E2%80%8D-author)

## ✨ Features

### 🔐 Authentication & Security

- **DummyJSON Authentication**: Login with username/password using DummyJSON API
- **Session Management**: Automatic token storage and validation on app launch
- **Biometric Unlock**: Face ID/Touch ID authentication with password fallback
- **Auto-lock**: Automatic screen lock after 10 seconds of inactivity or when app goes to background
- **Secure Lock Overlay**: Content obscuring overlay for privacy protection

### 🛒 Product Management

- **All Products View**: Browse complete product catalog with thumbnails and titles
- **Category Filtering**: View products from any specific category
- **Pull-to-Refresh**: Manual data refresh on all product lists
- **Superadmin Capabilities**: Delete products (simulated) when logged in as superadmin
- **Offline Support**: View cached products even without internet connection

### 📱 User Experience

- **Offline Indicator**: Visual banner showing connection status
- **Instant Load**: MMKV-persisted cache provides immediate UI rendering
- **Smooth Animations**: Polished transitions and loading states
- **Bottom Tabs Navigation**: Easy access to All Products and Sign Out

## 🛠️ Technology Stack

### Core Technologies

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Navigation**: React Navigation (Expo Router)
- **State Management**: Redux Toolkit
- **Data Fetching**: React Query (TanStack Query)
- **Local Storage**: MMKV for high-performance key-value storage
- **Biometrics**: Expo Local Authentication

### Supporting Libraries

- **API Integration**: Axios
- **UI Components**: React Native Elements / Custom components
- **Testing**: Jest with React Testing Library
- **Code Quality**: ESLint with TypeScript rules

## 🚀 Getting Started

### Prerequisites

- Node.js >= 20.19.4
- yarn package manager
- iOS Simulator (for macOS) or Android Studio (for Android development)
- Expo CLI

### Installation

1. Clone the repository

   ```bash
   git clone https://github.com/ahmedd308/3-pages-store.git
   cd 3-pages-store
   ```

2. Install Javascript dependencies

   ```bash
   yarn install
   ```

3. Install iOS/Android dependencies

   ```bash
   # iOS
   yarn ios

   # Android
   yarn android
   ```

### Running the App

```bash
yarn start
```

## 📱 App Configuration

### Superadmin User

For testing delete functionality, use the following superadmin credentials:

- **Username**: `emilys`
- **Password**: `emilyspass`

> Note: Any username with `"role": "admin"` can be used as superadmin.

### Chosen Category

The app displays products from any desired category on the home screen.

## 📁 Project Structure

```
src/
├── app/                    # Expo Router app directory
│   ├── _layout.tsx        # Root layout with providers
│   ├── index.tsx          # Entry point / redirect logic
│   ├── (auth)/            # Authentication screens
│   │   └── login.tsx
│   └── (home)/            # Main app screens
│       ├── _layout.tsx    # Tab navigation layout
│       └── products.tsx   # All Products screen
├── components/            # Reusable UI components
│   ├── OfflineBanner.tsx
│   ├── LockScreen.tsx
│   └── HapticTab.tsx
├── data/                  # React Query hooks
│   ├── useAuthUser.ts
│   ├── useProducts.ts
│   ├── useCategories.ts
│   ├── useProductsByCategory.ts
│   └── mutations/
│       └── useDeleteProduct.ts
├── hooks/                 # Custom React hooks
│   ├── useAuthInit.ts
│   ├── useAutoLock.ts
│   └── useNetworkStatus.ts
├── services/              # API services
│   └── api.ts             # Axios instance & endpoints
├── store/                 # Redux store
│   ├── store.ts
│   └── slices/
│       ├── auth.slice.ts
│       └── lock.slice.ts
└── utils/                 # Utility functions
```

## 🧩 Architecture

### Feature-Based Organization

The project follows a feature-based architecture with clear separation of concerns:

- **App Directory**: Expo Router file-based routing for screen navigation
- **Data Layer**: React Query hooks for server state management
- **State Management**: Redux Toolkit for global app state (auth, lock status)
- **Features**: Self-contained modules with related components and logic
- **Services**: API communication layer with DummyJSON endpoints

### Key Design Decisions

1. **Offline-First with MMKV + React Query**

   - React Query manages all API calls with automatic background refetching
   - MMKV persists the query cache to disk for instant rehydration
   - Users see cached data immediately, even offline

2. **Biometric Security Layer**

   - Lock state managed globally via Redux
   - Inactivity timer tracks user interaction
   - Lock overlay component renders on top of all screens
   - Graceful fallback to password when biometrics unavailable

3. **Superadmin Pattern**
   - Configurable list of superadmin usernames
   - Conditional UI rendering based on auth state
   - Simulated delete operations (DummyJSON returns `isDeleted: true`)

## 🧪 Testing

Run the test suite:

```bash
# Run all tests
yarn test

# Generate coverage report
yarn test-coverage
```

Current test coverage includes:

- ✅ Component rendering tests
- ✅ Authentication flow tests
- ✅ React Query hook tests
- ✅ Redux slice tests

## 🔍 API Endpoints Used

The app integrates with the following DummyJSON endpoints:

- `POST /auth/login` - User authentication
- `GET /auth/me` - Session validation
- `POST /auth/refresh` - Refresh token
- `GET /products` - Fetch all products
- `GET /products/categories` - List available categories
- `GET /products/category/{category}` - Fetch products by category
- `DELETE /products/{id}` - Simulated product deletion

## ⚖️ Trade-offs & Future Improvements

### Trade-offs Made

1. **Simplified Error Handling**

   - Currently shows basic error messages
   - Could be improved with toast notifications or retry mechanisms

2. **Simulated Deletes**

   - DummyJSON doesn't persist deletes server-side
   - Optimistic UI updates provide immediate feedback
   - Production app would need real backend integration

3. **Basic Theming**
   - Light mode only for initial scope
   - Dark mode infrastructure could be added with minimal effort

### If I Had More Time

1. **Enhanced Features**

   - 🎨 Dark mode support with theme switching
   - 🔔 Advanced error handling with toast notifications
   - 📊 Product search and filtering capabilities
   - ♿ Comprehensive accessibility improvements

2. **Technical Improvements**

   - 🧪 Increase test coverage to 80%+ (currently focused on critical paths)
   - 🔄 Implement retry logic for failed API calls
   - ⚡ Performance monitoring and optimization

3. **User Experience**

   - ✨ Splash screen and icon
   - 🎭 Skeleton loaders instead of basic loading spinners
   - 🖼️ Image caching and optimization
   - ✋ Haptic feedback on interactions
   - 🌐 Internationalization (i18n) support

4. **DevOps**
   - 🚀 CI/CD pipeline with EAS Build
   - 📊 Code quality gates with Husky pre-commit hooks

## 🎯 Acceptance Checklist

- ✅ Login authenticates; token stored/applied; session restored with biometric prompt
- ✅ App auto-locks after 10s and on background; lock overlay obscures content
- ✅ Biometric unlock works; password fallback when biometrics unavailable
- ✅ All Products renders list; pull-to-refresh; offline banner when disconnected
- ✅ Specific Category renders filtered list (A flatlist is rendered with all categories to chose any category of desire)
- ✅ Superadmin can delete a product (UI updates; delete is simulated)
- ✅ React Query cache persists to MMKV and rehydrates on cold start

## 📄 License

This project is developed as a coding challenge demonstration.

## 👨‍💻 Author

Developed by Ahmed Esmat

**GitHub**: [@ahmeddesmat](https://github.com/ahmeddesmat)

## 🙏 Acknowledgments

- [DummyJSON](https://dummyjson.com/) for the free API
- [React Native](https://reactnative.dev/) community
- [Expo](https://expo.dev/) for the amazing developer experience
- [TanStack Query](https://tanstack.com/query) for powerful data synchronization
- All open-source contributors who make projects like this possible

---

**Built with ❤️ using React Native, TypeScript, and modern best practices**
