# Timetable manager

An application that aims to simplify the process of creating, managing and viewing school timetables.

## Project Setup Instructions

Follow these steps to set up the project:

1. **Clone this repository:**

   ```sh
   git clone https://github.com/kriss2006/timetable-manager.git
   cd timetable-manager
   ```

2. **Run the setup script:**

   ```sh
   setup.bat
   ```

   This script will:

   - Check if `pnpm` is installed. If not, it will prompt you to install it.
   - Generate a random `JWT_SECRET`.
   - Create a `.env` file in the `backend` directory with the following contents:
     ```env
     PORT=3001
     JWT_SECRET=<randomly-generated-secret>
     DATABASE_URL=mysql://user:password@localhost:3306/timetable_manager
     ```
   - Create a `.env` file in the `frontend` directory with the following contents:
     ```env
     API_URL=http://localhost:3000/api
     ```
   - Install the project dependencies using `pnpm install`.
   - Generate the Prisma client.
   - Run the database migrations.

Make sure you have MySQL installed and running on your machine. You can install it from [here](https://dev.mysql.com/downloads/).

3. **Update MySQL credentials:**

   - Open the `.env` file located in the `backend` folder and update the `user` and `password` in `DATABASE_URL` with your MySQL credentials.

4. **Run the project:**

   ```sh
   pnpm dev
   ```

   This will start both the backend and frontend servers.

5. **Access the application:**
   - Open your browser and go to `http://localhost:3000` to access the frontend.
   - The backend API will be available at `http://localhost:3001/api`.
