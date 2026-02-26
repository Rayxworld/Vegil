# Hosting SheildGuard Backend on Railway

Follow these steps to deploy your Node.js backend to Railway.

## 1. Prepare your Repository
Ensure your backend code is in a GitHub repository. Railway connects directly to GitHub for automatic deployments.

## 2. Create a Railway Project
1. Go to [Railway.app](https://railway.app) and sign in.
2. Click **New Project** -> **Deploy from GitHub repo**.
3. Select your repository.
4. If your backend is in a subdirectory (like `backend/ts-scan`), you will need to specify the **Root Directory** in Railway settings after the initial setup.

## 3. Configure Environment Variables
In the Railway dashboard, go to the **Variables** tab and add the following:
- `PORT`: 8080 (or any port you prefer, Railway will provide it)
- `NODE_ENV`: production

## 4. Deployment Command
Railway should automatically detect your `package.json`. Ensure your `scripts` in `package.json` include:
```json
"start": "ts-node src/index.ts"
```
Or, if you prefer building first:
```json
"build": "tsc",
"start": "node dist/index.js"
```

## 5. Persistent Volume (Optional but Recommended)
Since the backend uses a local SQLite file (`waitlist.db`), the data will be lost on每一次 redeploy unless you use a persistent volume.
1. In Railway, click **+ Add** -> **Volume**.
2. Mount the volume to the directory where your DB is stored (e.g., `/app/backend/data`).
3. Update your `DB_PATH` in `src/index.ts` to point to the mounted volume path.

## 6. Update Frontend
Once deployed, Railway will provide a public URL (e.g., `https://your-app.up.railway.app`). Update your frontend `.env.local` or Vercel environment variables:
`NEXT_PUBLIC_API_URL=https://your-app.up.railway.app`

## 7. Specific Values for your Dashboard

Based on your screenshots, here is exactly what to fill:

### Settings Tab
- **Root Directory**: `/backend/ts-scan` (You already have this)
- **Public Networking**: 
  - **Port**: `8080`
- **Build Command**: (Leave Empty)
- **Start Command**: `npm start`
- **Watch Paths**: `/backend/ts-scan/src/**`

### Variables Tab
Ensure you have these variables:
- `PORT`: `8080`
- `DB_PATH`: `/app/waitlist.db` (This is where the database will reside in the container)

> [!IMPORTANT]
> Since you are using a SQLite database, it is **CRITICAL** to add a **Volume** in Railway (under the `+ Add` menu) and mount it to `/app`. This ensures your user data isn't deleted every time you push an update. Or you can point `DB_PATH` to the volume path.
