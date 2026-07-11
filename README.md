# Veloce Jersey

This project runs independently of Lovable. The web app uses open-source React, TanStack Start, Vite, and Supabase as the database and authentication backend.

## Quick start

1. **Start the web application**
   
   Open a terminal window and navigate to the `frontend` directory:
   ```powershell
   cd frontend
   npm install
   npm run dev
   ```
   The Vite dev server will start at `http://localhost:3000`.

2. **Accessing the Admin Panel**
   
   An admin account has already been initialized.
   
   - Go to `http://localhost:3000` and click the **Account / Sign In** option.
   - Sign in with the following admin credentials:
     - **Email:** `hemanthmadhusudhan@gmail.com`
     - **Password:** `Hemanth@1234`
   
   Once logged in, the **Admin** button will appear in the top navigation bar, allowing you to access the Atelier Control / Admin Panel.

## Production build

To bundle the frontend for production deployment:
```powershell
cd frontend
npm run build
npm run preview
```
