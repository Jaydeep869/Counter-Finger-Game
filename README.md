# &#x20;Counter FINGER GAME ( Web Application )

A full-stack MERN application featuring a reaction-based counting game with user authentication, profiles, and leaderboards. Test your reflexes by clicking the button when it turns red and climb the global leaderboard!

## Features

- **User Authentication:** Secure registration and login using JWT.
- **Reaction Game:** Click the red button as quickly as possible.
- **User Profiles:** View your statistics including high score, average score, and games played.
- **Global Leaderboard:** See how you rank against other players.
- **Responsive Design:** Optimized for both mobile and desktop devices.

## Tech Stack

- **Frontend:** React, Redux Toolkit, CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT (JSON Web Tokens)

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB database (local instance or MongoDB Atlas)
- npm or yarn

### Installation & Local Deployment

#### Clone the Repository

```bash
git clone https://github.com/Jaydeep869/Counter-Finger-Game.git
cd Counter-Finger-Game
```

#### Setup and Install Dependencies

This repository contains two separate folders: `client` and `server`.

### Server Setup

Navigate to the server directory:

```bash
cd server
```

Install dependencies:

```bash
npm install
```

Create a `.env` file in the `server` directory with the following configuration:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@<your-cluster-url>/game_counter?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

Run the server:

```bash
npm run dev
```

The server will be available at `http://localhost:5000`.

### Client Setup

Open a new terminal and navigate to the client directory:

```bash
cd client
```

Install dependencies:

```bash
npm install
```

Create a `.env` file in the `client` directory with the following configuration:

```env
VITE_PORT=3000
VITE_API_URL=http://localhost:5000/api
```

Run the client:

```bash
npm run dev
```

The client will be available at `http://localhost:3000`.

## Deployment

### Production Build

#### Building the Client

Before deploying, build the client for production:

```bash
cd client
npm run build:prod
```

## Project Structure

```
Counter-Game-With-Auth/
├── client/               # React frontend
│   ├── public/           # Static files
│   ├── src/              # Source files
│   │   ├── components/   # Reusable components
│   │   ├── features/     # Redux slices and logic
│   │   ├── pages/        # Page components
│   │   ├── store/        # Redux store configuration
│   │   └── ...
│   └── ...
├── server/               # Express backend
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Custom middleware
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   └── index.js          # Server entry point
└── ...
```

## API Endpoints

### Authentication

- **Register:** `POST /api/auth/register`
- **Login:** `POST /api/auth/login`
- **Get Current User:** `GET /api/auth/user`
- **Update Profile:** `PUT /api/auth/update`

### Scores

- **Save a New Score:** `POST /api/scores`
- **Global Leaderboard:** `GET /api/scores/leaderboard`
- **User Scores:** `GET /api/scores/user`
- **User Statistics:** `GET /api/scores/stats`

## License

This project is licensed under the MIT License.

## Acknowledgements

- React for the robust frontend framework.
- MongoDB for the flexible, scalable database.
- Express.js for the lightweight backend framework.
- Redux for state management.


