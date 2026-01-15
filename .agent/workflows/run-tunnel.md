---
description: Start the dev server and create a Cloudflare tunnel to share the website
---

# Run Tunnel Workflow

## Steps

1. Make sure the dev server is running on port 5173
// turbo
2. Start the Cloudflare tunnel:
```powershell
npx cloudflared tunnel --url http://localhost:5173
```

3. Look for the tunnel URL in the output (e.g., `https://something.trycloudflare.com`)

4. Share the URL with your friend!

## Notes
- The URL changes every time you restart the tunnel
- The tunnel only works while your computer is on
- For a permanent link, deploy to Vercel instead
