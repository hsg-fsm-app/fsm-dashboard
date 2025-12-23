# FSM Dashboard API Integration

This dashboard controls your webapp's frontend configuration through a centralized API.

## Architecture

```
┌─────────────────────┐         ┌──────────────────┐         ┌─────────────────┐
│  Admin Dashboard    │         │  Express Server  │         │  Your Webapp    │
│  (React/Vite)       │◄────────┤  (site-config)   │────────►│  (Client Site)  │
│  localhost:5173     │  Saves  │  localhost:3000  │  Reads  │                 │
└─────────────────────┘         └──────────────────┘         └─────────────────┘
```

## API Endpoints

### 1. Get Site Configuration
**Your webapp uses this to fetch the current config**

```bash
GET http://localhost:3000/api/site-config
```

Response:
```json
{
  "theme": {
    "primaryColor": "#ff6a3e",
    "secondaryColor": "#ffba43",
    "accentColor": "#1a1a1a",
    "logoUrl": "/assets/images/logo.svg",
    "logoDarkUrl": "/assets/images/logo-dark.svg",
    "faviconUrl": "/favicon.ico"
  },
  "company": {
    "name": "Your Company Name",
    "phone": "(555) 123-4567",
    "email": "info@company.com",
    "address": "123 Main St, City, ST 12345"
  },
  "modules": {
    "projectEstimator": {
      "enabled": true,
      "locked": false,
      "path": "/estimator/",
      "name": "Project Estimator",
      "description": "..."
    }
  }
}
```

### 2. Get CSS Variables
**Your webapp can directly link to this for instant theme updates**

```bash
GET http://localhost:3000/api/site-config/css
```

Response:
```css
:root {
  --primary: #ff6a3e;
  --secondary: #ffba43;
  --headerColor: #1a1a1a;
}
```

### 3. Save Configuration
**Dashboard uses this to push config changes**

```bash
POST http://localhost:3000/api/site-config/save
Content-Type: application/json

{
  "theme": { ... },
  "company": { ... },
  "modules": { ... }
}
```

## Integration with Your Webapp

### Option 1: Link to CSS Endpoint (Easiest)
Add this to your webapp's HTML `<head>`:

```html
<link rel="stylesheet" href="http://localhost:3000/api/site-config/css">
```

### Option 2: Fetch JSON and Apply (More Control)
Add this script to your webapp:

```html
<script>
  fetch('http://localhost:3000/api/site-config')
    .then(res => res.json())
    .then(config => {
      // Apply theme colors
      document.documentElement.style.setProperty('--primary', config.theme.primaryColor);
      document.documentElement.style.setProperty('--secondary', config.theme.secondaryColor);
      document.documentElement.style.setProperty('--headerColor', config.theme.accentColor);
      
      // Update company info
      document.querySelector('.company-name').textContent = config.company.name;
      document.querySelector('.company-phone').textContent = config.company.phone;
      
      // Show/hide features based on enabled modules
      if (config.modules.projectEstimator.enabled) {
        document.querySelector('.estimator-section').style.display = 'block';
      }
    });
</script>
```

### Option 3: Server-Side Rendering
If your webapp uses SSR (e.g., Express + EJS/Handlebars):

```javascript
// In your webapp's server
app.get('/', async (req, res) => {
  const configResponse = await fetch('http://localhost:3000/api/site-config');
  const config = await configResponse.json();
  
  res.render('index', { config });
});
```

Then in your template:
```html
<style>
  :root {
    --primary: <%= config.theme.primaryColor %>;
    --secondary: <%= config.theme.secondaryColor %>;
    --headerColor: <%= config.theme.accentColor %>;
  }
</style>

<h1><%= config.company.name %></h1>
<a href="tel:<%= config.company.phone %>"><%= config.company.phone %></a>
```

## Running Both Servers

### Terminal 1 - Express API Server
```bash
npm run server
# Runs on http://localhost:3000
```

### Terminal 2 - Dashboard Frontend
```bash
npm run dev
# Runs on http://localhost:5173
```

### Your Webapp
Configure it to fetch from `http://localhost:3000/api/site-config`

## Production Deployment

1. **Deploy Express Server** to your hosting (e.g., Heroku, DigitalOcean, AWS)
   - Update API URL in production
   
2. **Deploy Dashboard** as a static site (e.g., Netlify, Vercel)
   - Update API_URL in `src/hooks/useAdminDashboard.ts`
   
3. **Update Your Webapp** to point to production API URL
   ```html
   <link rel="stylesheet" href="https://api.yourdomain.com/api/site-config/css">
   ```

## Security Considerations

⚠️ **Important:** The `/api/site-config/save` endpoint should be protected!

Add authentication:
```javascript
// server.js
app.post("/api/site-config/save", authenticateAdmin, (req, res) => {
  // ... save logic
});

function authenticateAdmin(req, res, next) {
  const token = req.headers.authorization;
  if (!token || !verifyToken(token)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}
```

## Next Steps

- [ ] Add database persistence (MongoDB, PostgreSQL)
- [ ] Add authentication/authorization
- [ ] Add webhook to trigger webapp rebuild
- [ ] Add config version history
- [ ] Add rollback functionality
