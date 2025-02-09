@echo off
echo Setting up the project...

echo Checking if pnpm is installed...
pnpm --version >nul 2>&1
IF ERRORLEVEL 1 (
    echo pnpm is not installed. Please install it by running: npm install -g pnpm
    exit /b 1
)

echo Checking if MySQL is installed...
mysql --version >nul 2>&1
IF ERRORLEVEL 1 (
    echo MySQL is not installed. Please install it from: https://dev.mysql.com/downloads/
    exit /b 1
)

echo Generating a random JWT_SECRET
FOR /F "usebackq tokens=*" %%i IN (`powershell -Command "[guid]::NewGuid().ToString()"`) DO SET JWT_SECRET=%%i

echo Generating .env file for backend...
(
echo PORT=3001
echo JWT_SECRET=%JWT_SECRET%
echo DATABASE_URL=mysql://user:password@localhost:3306/timetable_manager
) > backend/.env

echo Generating .env file for frontend...
(
echo API_URL=http://localhost:3000/api
) > frontend/.env

echo Installing dependencies...
pnpm install

echo Generating Prisma client...
npx prisma generate

echo Running database migrations...
npx prisma migrate dev --name init

echo Setup complete.
echo Remember to provide your proper MySQL credentials in the backend/.env file