@echo off
echo ============================================
echo   CoachOS - Starting Tunnel
echo ============================================
echo.
echo Starting Cloudflare tunnel on port 5173...
echo.
echo IMPORTANT: Make sure 'npm run dev' is running in another terminal first!
echo.
echo Look for your shareable URL below (e.g., https://xxx.trycloudflare.com)
echo.
echo ============================================
echo.
npx cloudflared tunnel --url http://localhost:5173
pause
