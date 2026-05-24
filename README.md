# Learning Tracking Management System

A React + Express learning tracker that stores users, assignments, progress, and notes in Excel files instead of a database.

## Structure

- `frontend/` React application
- `backend/` Express API and Excel services
- `excel-storage/` generated `.xlsx` files

## Run

1. Install frontend dependencies: `cd frontend && npm install`
2. Install backend dependencies: `cd backend && npm install`
3. Start backend: `npm run dev`
4. Start frontend: `npm run dev`

The backend bootstraps these files on first start:

- `excel-storage/users.xlsx`
- `excel-storage/assignments.xlsx`
- `excel-storage/progress.xlsx`
- `excel-storage/notes.xlsx`

Default users:

- `admin / admin123`
- `om / om123`
# learning-tracker
# learning-tracker
