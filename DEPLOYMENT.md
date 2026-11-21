# NutriSense deployment (free demo setup)

## Hosting layout
- Frontend: Vercel (Vite static site)
- Backend: Render (FastAPI web service)
- The frontend reads `VITE_API_BASE_URL`; local development still defaults to `http://localhost:8000`.

## 1. Put the project on GitHub
1. Extract this ZIP.
2. Create a new **private** GitHub repository (recommended while preparing the demo).
3. Upload the contents of this folder, not the ZIP itself. Keep `backend/models/*.joblib`.
4. Do not upload `node_modules`, `.venv`, secrets, or real personal health data.

## 2. Deploy the API on Render
1. In Render, choose **New → Blueprint** and connect the GitHub repository.
2. Render detects `render.yaml`. Review the `nutrisense-api` service and choose the Free plan.
3. Deploy. The health check should be `https://YOUR-SERVICE.onrender.com/health`.
4. Open that `/health` URL. It should return JSON with `status: ok`.
5. Keep the backend URL; you will add it to Vercel next.

If creating the service manually instead of using the Blueprint:
- Root Directory: `backend`
- Build Command: `pip install -r requirements-deploy.txt`
- Start Command: `uvicorn main:app --app-dir app --host 0.0.0.0 --port $PORT`
- Health Check Path: `/health`

## 3. Deploy the frontend on Vercel
1. In Vercel, choose **Add New → Project** and import the same GitHub repository.
2. Set **Root Directory** to `frontend`.
3. Framework preset: Vite; Build Command: `npm run build`; Output Directory: `dist`.
4. Add Environment Variable:
   - Name: `VITE_API_BASE_URL`
   - Value: `https://YOUR-SERVICE.onrender.com` (no trailing slash)
   - Apply it to Production (and Preview if desired).
5. Deploy or redeploy after setting the variable.

## 4. Verify the complete app
1. Open the Vercel URL.
2. Open browser developer tools → Network if API calls fail.
3. Test `/health`, prediction, recommendations, meal plan, recipes, and history.
4. If the frontend still calls localhost, check the Vercel environment variable and redeploy.

## Important demo limitations
- Render's free web services sleep after 15 minutes without traffic; the first request after sleep can take about a minute.
- Render free filesystems are ephemeral. This app's SQLite history database can reset after a restart/redeploy/sleep. Treat history as demo-only unless you move it to durable storage.
- The app is a demo screening tool, not a medical diagnosis. It uses synthetic training data. Do not enter real or sensitive health information into a public demo.
- The API currently allows cross-origin requests broadly and the demo login is not real authentication. Do not present it as a production service or store private user records.
- Free hosting has resource limits; the model/SHAP service may need optimization if the free backend runs out of memory.
