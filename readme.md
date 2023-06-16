# Chat App
This is a simple chat application built with Angular, Socket.IO, and MongoDB.

## Features
- Real-time messaging between multiple users
- Messages are stored in a MongoDB database
- Uses Socket.IO for real-time communication

## Installation
1. Clone the repository.
2. Navigate to the project directory.
3. Install the dependencies.

## Configuration
1. Set up MongoDB
- Install MongoDB on your local machine or use a remote MongoDB service.
- Update the MongoDB connection URL in `server.js` file.

2. Set up Socket.IO:
- Ensure Socket.IO server is running and accessible.
- Update the Socket.IO server URL in `src/app/socket.service.ts` file.

## Usage
1. Start the development server: ng serve
2. Open your browser and navigate to `http://localhost:4200`.
3. Register a new account or login with an existing account.
4. Start chatting with other users in real-time.


