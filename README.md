# Blabbl Backend

This is the backend service for the [Blabbl](https://blabbl.netlify.app/) messaging web app. It provides RESTful APIs for user authentication, messaging, and real-time communication.

---

## Features

- **User Authentication:** Sign up, login, JWT-based authentication.
- **User Profiles:** View and update user information.
- **Contacts:** Add, remove, and list contacts.
- **Messaging:** Send, receive, and fetch messages.
- **Real-Time Messaging:** WebSocket support for instant message delivery.

---

## Tech Stack

- **Node.js** with **Express.js** (REST API)
- **MongoDB** (Database)
- **Mongoose** (ODM)
- **Socket.IO** (Real-time communication)
- **JWT & JWKS-RSA** (Authentication)

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (18.0.0+ recommended)
- [npm](https://www.npmjs.com/)

### Installation

```bash
git clone https://github.com/muh-arifulislam/blabbl-backend
cd blabbl-backend
npm install
```

### Environment Variables

After cloning the project, you need to set up the required environment variables. Create a `.env` file in the root directory and add the following:

```env
NODE_ENV=development | production
PORT=5000
DATABASE_URL=your_mongodb_database_url
FRONTEND_URL=frontend_url
AUTH0_DOMAIN=your_auth_domain
AUTH0_CLIENT_ID=your_auth0_client_id
AUTH0_AUDIENCE=your_auth0_audience
AUTH0_ISSUER=your_auth0_issuer
```

## Development

To start the development server:

```bash
npm run start:dev
```

The app will be available at [http://localhost:5000](http://localhost:5000).

## Build

To create a production build:

```bash
npm run build
```

The output will be in the `dist/` directory.

## License

This project is licensed under the [MIT License](LICENSE).
