# 🚀 Interview Simulator - Command Cheat Sheet

Use these commands to manage your project.

## 1. Start the Frontend
Go to the frontend directory and start the development server.
```powershell
cd betch-iup
npm install  # (Only if node_modules is missing)
npm run dev
```
*Accessible at: http://localhost:5173*

## 2. Start the Backend
Go to the backend directory and start the server.
```powershell
cd betch-iup-backend
npm install  # (Only if node_modules is missing)
node server.js
```
*Running on: http://localhost:5000*

## 3. Populate / Reset Questions
If you want to clear the database and reload all 80+ real questions:
```powershell
cd betch-iup-backend
node seed.js
```
> [!WARNING]
> This will DELETE all existing users and sessions. You will need to log in again using the "Use Demo Account" button.

## 4. Git Commands
To save your work and push to GitHub:
```powershell
git add .
git commit -m "Describe your changes here"
git push origin main
```

## 5. Troubleshooting "Cannot read properties of null"
If the app crashes or shows a "Setup Failed" error:
1. Go to http://localhost:5173/login
2. Sign out if needed.
3. Use **"Demo Account"** to sign back in.
4. This refreshes your token and fixes the sync with the database.
