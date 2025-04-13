# StockPro - Full Stack Trading Platform

StockPro is a full-stack trading platform that allows users to register, log in, make trades, view portfolios, and see real-time market data. The application consists of a **React-based frontend** and a **Node.js microservices backend** that includes REST APIs, Redis streams, and WebSocket communication.

## 🔧 Project Structure

The project is divided into a frontend and three backend services:

### 📦 Frontend - stock-pro

* This is the React project responsible for the UI.
* Users can:
    * Register/Login
    * View their portfolio
    * Place market or limit orders
    * Monitor live trades, candles, and the order book

#### ▶️ How to Run the Frontend

cd frontend/stock-pronpm installnpm run dev
### 📦 Backend - Node.js Microservices

The backend consists of three Node.js services:

* **User Service:** Handles user authentication, portfolio management, and order placement via REST APIs.
* **Order Matching Engine:** Processes orders, executes trades, matches buyers and sellers, and generates candle data. Communicates using Redis streams.
* **Realtime Gateway:** Provides real-time market data (order updates, candles, order book, trade book) to the frontend via WebSocket communication (Socket.IO) and Redis Pub/Sub.

#### 📦 Backend Service Details

1.  **User Service**

    * Communicates with the frontend via REST APIs.
    * Handles user login, signup, portfolio viewing, adding/withdrawing money, and placing orders (limit and market).
    * When a user places an order, it is sent from the user service to the order-matching engine.

2.  **Order Matching Engine**

    * The core of the trading platform.
    * Handles order execution, order processing, order matching, and candle generation based on trades.
    * Sends data to the realtime gateway service via Redis Pub/Sub.

3.  **Realtime Gateway**

    * A WebSocket service.
    * Receives data from the order-matching engine via Redis Pub/Sub.
    * Sends real-time updates to the frontend via Socket.IO.
    * Data includes order updates, real-time candles, the order book, and the trade book.

#### ▶️ How to Run the Backend Services

Each service has its own directory and needs to be set up and run individually.

**1. User Service**

To run the `user-service`:

cd backend/user-servicenpm installnpm run setup:db:envnpm run prisma:migrate  # If running for the first timenpm run prisma:deploy   # If running in productionnpm run prisma:generatenpm run seed          # For the first timenpm run start
**Important Notes for User Service:**

* You must set up the `.env` file based on the provided `.env.example`. This file contains environment-specific variables like database URLs, API keys, and port numbers.
* After running the seed command, you will have 10 pre-configured users with their portfolios. The login credentials are:
    * Emails: `user1@example.com` to `user10@example.com`
    * Passwords: `password1` to `password10`

**2. Order Matching Engine**

To run the `order-matching-engine`:

cd backend/order-matching-enginenpm installnpm run setup:db:envnpm run prisma:generatenpm run buildnpm run start
* Make sure to configure your `.env` file based on `.env.example`.

**3. Realtime Gateway**

To run the `realtime-gateway`:

cd backend/realtime-gatewaynpm installnpm run setup:db:envnpm run prisma:generatenpm run buildnpm run start
* Make sure to configure your `.env` file based on `.env.example`.

#### ▶️ Running with Docker Compose (Optional - for local development)

For easier local development, you can use Docker Compose to start PostgreSQL and Redis.

1.  Navigate to the `backend` directory:

    ```
    cd backend
    ```

2.  Start the services:

    ```
    docker-compose up -d
    ```

    This will start PostgreSQL and Redis in detached mode.

3.  (Optional) To enter the PostgreSQL database:

    ```
    docker exec -it postgresql /bin/bash
    psql -U postgres -d stockpro
    ```
