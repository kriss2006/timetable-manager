@echo off
cd backend

echo Generating Prisma client...
pnpm prisma generate

echo Running database migrations...
pnpm prisma migrate dev --name init