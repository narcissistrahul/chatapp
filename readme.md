# Chat App
This is a simple chat application built with Angular, Socket.IO, and MongoDB.

## Features
- Real-time messaging between multiple users (This app allows for the same using same instance of the app open in different tabs.)
- Messages are stored in a MongoDB database (local -> chat-app will contain all documents which follow the Message schema.)
- Uses Socket.IO for real-time communication (on, emit events enabled to read/pass messages between server and client.)

## Configuration
1. Set up MongoDB
- Install MongoDB on your local machine or use a remote MongoDB service.
- Update the MongoDB connection URL in `server.js` file.

2. Set up Socket.IO:
- Ensure Socket.IO server is running and accessible.

## Installation and usage
1. Clone the repository.
2. Navigate to the project directory.
3. Navigate to `backend` . Install dependencies: `npm install`. Then `npm run start`.
This fires up the backend server to relay messages on localhost:3000.
4. In a new terminal, navigate to `frontend`. Install dependencies: `npm install`. Then `npm run start`.
This opens up the application on localhost:4200.
5. Open the application in different tabs to view as different users.