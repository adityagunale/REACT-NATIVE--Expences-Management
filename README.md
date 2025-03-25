# Expenses Management App

A React Native mobile application built with Expo for managing personal finances. Track your income and expenses, view your balance, and manage your financial transactions.


## Features

- **User Authentication**: Secure login and registration system
- **Transaction Management**: Add, edit, and delete income and expense transactions
- **Financial Overview**: View your balance, total income, and total expenses
- **Transaction Categories**: Categorize your transactions for better organization
- **User Profile**: Manage your account settings


## Tech Stack
### Frontend
- React Native
- Expo
- Redux Toolkit for state management
- React Navigation for routing
- Axios for API requests
- TypeScript for type safety

### Backend
- Node.js
- Express.js
- MongoDB for database
- JWT for authentication
- Mongoose for database modeling

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- MongoDB (local or Atlas)
- Expo CLI

### Installation

1. Clone the repository:
```
git clone https://github.com/yourusername/expenses-management.git
cd expenses-management
```

2. Install dependencies:
```
npm install
```

3. Set up environment variables:
   - Create a `.env` file in the backend directory
   - Add the following variables:
     ```
     NODE_ENV=development
     PORT=5000
     MONGO_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret_key
     JWT_EXPIRE=30d
     ```

4. Start the backend server:
```
cd backend
npm run dev
```

5. Start the Expo development server:
```
cd ..
npm start
```

6. Run on your device or emulator:
   - Scan the QR code with the Expo Go app (Android) or Camera app (iOS)
   - Press 'a' to run on Android emulator
   - Press 'i' to run on iOS simulator

## Project Structure

```
expenses-management/
├── backend/                # Backend code
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── controllers/    # Request handlers
│   │   ├── middleware/     # Custom middleware
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   └── server.js       # Server entry point
│   └── package.json        # Backend dependencies
├── src/                    # Frontend code
│   ├── api/                # API service
│   ├── components/         # Reusable components
│   ├── navigation/         # Navigation configuration
│   ├── redux/              # Redux store and slices
│   │   ├── slices/         # Redux slices
│   │   └── store.ts        # Redux store configuration
│   └── screens/            # App screens
│       ├── auth/           # Authentication screens
│       └── ...             # Other screens
├── App.tsx                 # Main app component
├── app.json                # Expo configuration
└── package.json            # Frontend dependencies
```

## API Endpoints

### Authentication
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login a user
- `GET /api/users/me` - Get current user

### Transactions
- `GET /api/transactions` - Get all transactions for the current user
- `GET /api/transactions/:id` - Get a specific transaction
- `POST /api/transactions` - Create a new transaction
- `PUT /api/transactions/:id` - Update a transaction
- `DELETE /api/transactions/:id` - Delete a transaction

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Expo](https://expo.dev/)
- [React Native](https://reactnative.dev/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/) 
