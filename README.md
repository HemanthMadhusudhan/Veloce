# Veloce Jersey

This project runs independently of Lovable. The web app uses open-source React, TanStack Start, Vite, and PocketBase as the local database and authentication backend.

## Quick start (PocketBase Local Backend)

1. **Start the PocketBase server**
   
   PocketBase is bundled with the repository. Run this command in a terminal to start the local backend database:
   ```powershell
   .\pocketbase\pocketbase.exe serve
   ```
   *Note: This starts PocketBase listening at `http://127.0.0.1:8090`. Keep this window open.*

2. **Start the web application**
   
   Open a separate terminal window and run:
   ```powershell
   npm install
   npm run dev
   ```
   The Vite dev server will start at `http://localhost:3000`.

3. **Accessing the Admin Panel**
   
   An admin account has already been initialized in the PocketBase database. 
   
   - Go to `http://localhost:3000` and click the **Account / Sign In** option.
   - Sign in with the following admin credentials:
     - **Email:** `hemanthmadhusudhan@gmail.com`
     - **Password:** `Hemanth@1234`
   
   Once logged in, the **Admin** button will appear in the top navigation bar, allowing you to access the Atelier Control / Admin Panel.

4. **PocketBase Admin Dashboard**
   
   To manage database collections, users, and settings directly via the PocketBase UI:
   - Open `http://127.0.0.1:8090/_/` in your browser.
   - *If you want to log in as a PocketBase database superuser, you can create one by running: `.\pocketbase\pocketbase.exe superuser upsert your-email@example.com yourpassword` in your terminal.*

## Production build

To bundle the frontend for production deployment:
```powershell
npm run build
npm run preview
```
