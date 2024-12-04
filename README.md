# PrintPal

PrintPal is a web application designed to facilitate the submission and management of 3D printing requests. Users can register and log in to the platform, submit detailed 3D printing requests, and track the status of their submissions. The application supports user authentication, file uploads, and dynamic request handling. It also integrates with Large Language Models (LLMs) from OpenAI and Anthropic for potential AI-driven features.

## Overview

PrintPal is built using a modern web stack that includes:

- **Backend**: Node.js with the Express framework.
- **Frontend**: EJS templating engine for rendering dynamic HTML pages.
- **Database**: MongoDB for storing user and request data.
- **Session Management**: Express-session with connect-mongo for storing sessions in MongoDB.

### Project Structure

- **Models**: Defines the data structures and schemas using Mongoose.
  - `models/Request.js`
  - `models/User.js`
  - `models/StatusChangeThread.js`
- **Middleware**: Handles file uploads and authentication.
  - `middleware/uploadMiddleware.js`
  - `routes/middleware/authMiddleware.js`
- **Routes**: Defines the endpoints for authentication, request handling, user profiles, and the Kanban board.
  - `routes/authRoutes.js`
  - `routes/requestRoutes.js`
  - `routes/userRoutes.js`
  - `routes/kanbanRoutes.js`
- **Services**: Manages communication with LLM services.
  - `services/llm.js`
- **Views**: EJS templates for rendering HTML pages.
  - `views/`
- **Public**: Contains static files like CSS and JavaScript.
  - `public/css/style.css`
  - `public/js/main.js`
- **Server**: Main entry point for the application.
  - `server.js`
- **Sockets**: Manages WebSocket connections.
  - `socket.js`
- **Configuration**: Environment variables and settings.
  - `.env`
  - `.env.example`

## Features

1. **User Authentication**:
    - **Registration**: Users can register by providing a username and password. Each username generates a unique permalink.
    - **Login**: Registered users can log in using their username and password.
    - **Logout**: Users can log out, which destroys their session.

2. **3D Printing Request Submission**:
    - **Request Form**: Users can submit 3D printing requests by filling out a form with their name, email, model source link, primary color, secondary color, accent color, and optionally uploading a model file.
    - **File Upload**: Users can upload model files in .stl, .3mf, .step, and .obj formats with a maximum size of 10 MB.
    - **Validation**: The form validates that all required fields are filled and that either a model source link or a model file is provided.

3. **Request Management**:
    - **Status Tracking**: Each request has a status that can be updated through various stages such as 'New', 'Accepted', 'In-progress', 'Finishing', 'Completed', 'Delivered', and 'Rejected'.
    - **Confirmation Page**: After submitting a request, users are redirected to a confirmation page displaying the details of their submission.
    - **Status Change Thread**: Each request includes a thread document that tracks the timestamp of changes in status.

4. **User Profile**:
    - **Profile View**: Users can view their profile, which shows their username and a permalink to their request submission form.

5. **LLM Integration**:
    - **LLM Service**: The application includes a service module that facilitates communication with OpenAI and Anthropic LLMs for potential AI-driven features.

6. **Kanban Board**:
    - **Main Page**: Logged-in users have a kanban style board as their main page to track the requests guests have submitted to them.
    - **Request Cards**: Each request is represented by a card.
    - **Status Lanes**: Each status has a lane, and cards are sorted into each lane appropriately.
    - **Styling**: The lanes and cards are styled for visual clarity, with different colors for each lane and reduced opacity for the 'Rejected' lane.

## Getting Started

### Requirements

To run PrintPal, you need to have the following technologies installed on your computer:

- Node.js
- MongoDB (or use a cloud version such as MongoDB Atlas)

### Quickstart

1. **Clone the repository**:
   ```sh
   git clone <repository-url>
   cd printpal
   ```

2. **Install dependencies**:
   ```sh
   npm install
   ```

3. **Set up environment variables**:
   - Copy `.env.example` to `.env` and fill in the required values.
     ```sh
     cp .env.example .env
     ```

4. **Start the application**:
   ```sh
   npm start
   ```

5. **Access the application**:
   Open your browser and navigate to `http://localhost:<PORT>` (replace `<PORT>` with the port number specified in your `.env` file).

### License

The project is proprietary (not open source). 

```
© 2024 PrintPal. All rights reserved.
```