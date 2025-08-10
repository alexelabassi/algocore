# AlgoCore Frontend

A React-based frontend for the AlgoCore LeetCode-style coding platform.

## Features

### Authentication
- User registration and login
- JWT token management with automatic refresh
- Protected routes for authenticated users
- Role-based access control (Admin/User)

### Problem Management
- Browse all coding problems with search and filtering
- View problem details with markdown descriptions
- Filter by difficulty (Easy, Medium, Hard) and school grade
- Client-side search functionality

### Code Editor
- Monaco Editor integration with syntax highlighting
- Support for multiple programming languages (Java, Python, C++)
- Pre-loaded starter code templates
- Real-time code editing

### Submission System
- Submit solutions and get immediate feedback
- View detailed submission results including:
  - Runtime and memory usage
  - Standard output and error messages
  - Failed test case details with expected vs actual output
- Support for multiple submission results (Accepted, Wrong Answer, Runtime Error, etc.)

### User Interface
- Modern, responsive design with Tailwind CSS
- Mobile-friendly navigation
- Toast notifications for user feedback
- Loading states and error handling

## Tech Stack

- **React 18** with TypeScript
- **React Router** for navigation
- **Axios** for API communication
- **Monaco Editor** for code editing
- **Tailwind CSS** for styling
- **React Hot Toast** for notifications
- **Lucide React** for icons

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend server running (see backend README)

### Installation

1. Clone the repository and navigate to the frontend directory:
```bash
cd algocore-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory (optional):
```env
REACT_APP_API_URL=http://localhost:8080
```

4. Start the development server:
```bash
npm start
```

The application will be available at `http://localhost:3000`.

### Available Scripts

- `npm start` - Start the development server
- `npm run build` - Build the app for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App (not recommended)

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Loader.tsx      # Loading spinner
│   ├── Navigation.tsx  # Main navigation
│   ├── ProblemCard.tsx # Problem list item
│   └── ProtectedRoute.tsx # Auth protection wrapper
├── contexts/           # React contexts
│   └── AuthContext.tsx # Authentication state management
├── pages/              # Page components
│   ├── LoginPage.tsx   # User login
│   ├── RegisterPage.tsx # User registration
│   ├── ProblemsPage.tsx # Problems list
│   └── ProblemDetailPage.tsx # Problem view with editor
├── services/           # API services
│   └── api.ts         # Main API client
├── types/              # TypeScript type definitions
│   └── index.ts       # All type definitions
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
├── App.tsx            # Main app component
└── index.tsx          # App entry point
```

## API Integration

The frontend integrates with the AlgoCore backend API:

### Authentication Endpoints
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /auth/refresh` - Token refresh

### Problem Endpoints
- `GET /problems` - Get all problems
- `GET /problems/:id` - Get problem details
- `POST /problems/create` - Create new problem (Admin only)

### Submission Endpoints
- `POST /problems/:id/submit` - Submit solution

## Environment Variables

- `REACT_APP_API_URL` - Backend API URL (default: http://localhost:8080)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is part of the AlgoCore platform.
