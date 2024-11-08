# Serenity

## Overview
Serenity is a web application designed to promote mental well-being through various activities such as meditation, journaling, and deep breathing exercises. The application provides a user-friendly interface for users to register, log in, and manage their mental health activities effectively.

## Features
- User authentication (registration, login, logout)
- Email verification for new users
- Password reset functionality
- Dashboard for tracking mental well-being activities
- Responsive design for both desktop and mobile devices
- Dark and light mode support
- Contact page for user inquiries

## Tech Stack
- **Frontend:**
  - React
  - Chakra UI
  - React Router
  - Redux Toolkit
  - Axios

- **Backend:**
  - Node.js
  - Express
  - MongoDB (with Mongoose)
  - JWT for authentication
  - Nodemailer for email services
  - Joi for validation

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contributors
- [Your Name](https://github.com/yourusername) - Initial work and ongoing development
- [Contributor Name](https://github.com/contributorusername) - Feature contributions and bug fixes

## Getting Started
To get a local copy up and running follow these simple steps.

### Prerequisites
- Node.js
- npm (Node package manager)
- MongoDB (for the backend)

### Installation
1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/serenity.git
   ```
2. Navigate to the frontend directory
   ```bash
   cd serenity/frontend
   ```
3. Install frontend dependencies
   ```bash
   npm install
   ```
4. Navigate to the backend directory
   ```bash
   cd ../backend
   ```
5. Install backend dependencies
   ```bash
   npm install
   ```
6. Create a `.env` file in the backend directory and add your environment variables (e.g., MongoDB URI, JWT secret, email service credentials).
7. Start the backend server
   ```bash
   npm start
   ```
8. Start the frontend application
   ```bash
   cd ../frontend
   npm start
   ```

Now you can access the application at `http://localhost:3000`.

## Acknowledgments
- Inspiration from various mental health applications
- Chakra UI for the beautiful component library
- React community for the support and resources