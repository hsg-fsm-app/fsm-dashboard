// ─────────────────────────────────────────────────────────────────────────────
// CLIENT WEBSITE INTEGRATION EXAMPLE
// This shows how a client-facing website interacts with the Dashboard API
// ─────────────────────────────────────────────────────────────────────────────

/**
 * FLOW DIAGRAM:
 * 
 * ┌─────────────────┐         ┌──────────────────┐         ┌─────────────────┐
 * │                 │         │                  │         │                 │
 * │  Admin User     │────1───>│  Dashboard UI    │────2───>│ Dashboard API   │
 * │  (Dashboard)    │  Edits  │  /admin-dash     │  PUT    │ server.js       │
 * │                 │  colors │                  │         │                 │
 * └─────────────────┘         └──────────────────┘         └────────┬────────┘
 *                                                                    │
 *                                                                    │ 3. Validates
 *                                                                    │    & Saves
 *                                                                    │
 *                                                                    ▼
 *                                                          ┌──────────────────┐
 *                                                          │  site-config.js  │
 *                                                          │  (Single Source  │
 *                                                          │   of Truth)      │
 *                                                          └────────┬─────────┘
 *                                                                   │
 *                                                    4. Webhook     │
 *                                                    Notification   │
 *                                                                   │
 *                           ┌───────────────────────────────────────┘
 *                           │
 *                           ▼
 *                  ┌─────────────────┐
 *                  │                 │
 *                  │  Client Website │────5. Fetches────┐
 *                  │  (Another       │     new config   │
 *                  │   Server)       │<─────────────────┘
 *                  │                 │
 *                  └────────┬────────┘
 *                           │
 *                           │ 6. Updates
 *                           │    CSS vars
 *                           │
 *                           ▼
 *                  ┌─────────────────┐
 *                  │  User sees      │
 *                  │  new colors     │
 *                  │  instantly      │
 *                  └─────────────────┘
 */

// ─────────────────────────────────────────────────────────────────────────────
// CLIENT WEBSITE CODE (Separate Server)
// ─────────────────────────────────────────────────────────────────────────────

const DASHBOARD_API_URL = "http://localhost:3000/api"
const WEBHOOK_SECRET = "your-secret-key-here"

/**
 * STEP 1: Initial Setup - Fetch config on website startup
 */
async function initializeSiteConfig() {
  try {
    const response = await fetch(`${DASHBOARD_API_URL}/site-config`)
    const { data } = await response.json()
    
    // Apply configuration to website
    applySiteConfig(data)
    
    console.log("✓ Site config loaded successfully")
  } catch (error) {
    console.error("Failed to load site config:", error)
  }
}

/**
 * STEP 2: Register webhook to receive real-time updates
 */
async function registerWebhook() {
  const webhookUrl = "https://your-client-website.com/api/config-webhook"
  
  try {
    const response = await fetch(`${DASHBOARD_API_URL}/webhooks/subscribe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url: webhookUrl,
        secret: WEBHOOK_SECRET
      })
    })
    
    const { subscriberId } = await response.json()
    console.log(`✓ Webhook registered: ${subscriberId}`)
    
    // Store subscriberId to unregister later if needed
    return subscriberId
  } catch (error) {
    console.error("Failed to register webhook:", error)
  }
}

/**
 * STEP 3: Webhook endpoint that receives config updates
 * This runs on YOUR client website server
 */
function setupWebhookEndpoint(app) {
  app.post("/api/config-webhook", async (req, res) => {
    // Verify webhook secret
    const signature = req.headers["x-webhook-secret"]
    if (signature !== WEBHOOK_SECRET) {
      return res.status(401).json({ error: "Invalid signature" })
    }

    const { event, config, theme, module, enabled } = req.body

    switch (event) {
      case "config.updated":
        // Full config update
        applySiteConfig(config)
        console.log("✓ Site config updated via webhook")
        break

      case "theme.updated":
        // Just theme colors changed
        applyTheme(theme)
        console.log("✓ Theme updated via webhook")
        break

      case "module.toggled":
        // A feature module was enabled/disabled
        console.log(`✓ Module ${module} ${enabled ? "enabled" : "disabled"}`)
        // Trigger route regeneration or feature flag update
        break
    }

    res.json({ success: true })
  })
}

/**
 * STEP 4: Apply configuration to website
 */
function applySiteConfig(config) {
  // Update CSS variables in <style> tag or stylesheet
  applyTheme(config.theme)
  
  // Update feature flags
  applyFeatures(config.features)
  
  // Update module availability
  applyModules(config.modules)
  
  // Cache config for SSR/SSG
  cacheConfig(config)
}

/**
 * Apply theme colors by injecting CSS variables
 */
function applyTheme(theme) {
  const css = `
    :root {
      --primary: ${theme.primaryColor};
      --secondary: ${theme.secondaryColor};
      --headerColor: ${theme.accentColor};
    }
  `
  
  // Option A: Update existing style tag
  let styleTag = document.getElementById("dynamic-theme")
  if (!styleTag) {
    styleTag = document.createElement("style")
    styleTag.id = "dynamic-theme"
    document.head.appendChild(styleTag)
  }
  styleTag.textContent = css
  
  // Option B: For SSR, write CSS file
  // fs.writeFileSync("./public/theme.css", css)
}

/**
 * Apply feature toggles
 */
function applyFeatures(features) {
  // Store in environment or config that your templates can access
  global.siteFeatures = features
  
  // Example: Hide/show sections based on features
  if (!features.showTestimonials) {
    document.querySelectorAll(".testimonials-section")?.forEach(el => {
      el.style.display = "none"
    })
  }
}

/**
 * Apply module availability (for routing/navigation)
 */
function applyModules(modules) {
  global.availableModules = Object.entries(modules)
    .filter(([_, m]) => m.enabled && !m.locked)
    .map(([key, m]) => ({ key, ...m }))
}

/**
 * Cache config for use in templates
 */
function cacheConfig(config) {
  global.siteConfig = config
  
  // For static site generators (11ty, Next.js, etc.)
  // fs.writeFileSync("./data/site-config.json", JSON.stringify(config, null, 2))
}

// ─────────────────────────────────────────────────────────────────────────────
// ALTERNATIVE: POLLING APPROACH (If webhooks aren't available)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Poll for config changes every N seconds
 * Use this if your host doesn't support webhooks
 */
function setupConfigPolling(intervalMs = 30000) {
  let lastConfig = null
  
  setInterval(async () => {
    try {
      const response = await fetch(`${DASHBOARD_API_URL}/site-config`)
      const { data } = await response.json()
      
      // Compare with last known config
      if (JSON.stringify(data) !== JSON.stringify(lastConfig)) {
        console.log("✓ Config changed, updating...")
        applySiteConfig(data)
        lastConfig = data
      }
    } catch (error) {
      console.error("Config polling error:", error)
    }
  }, intervalMs)
}

// ─────────────────────────────────────────────────────────────────────────────
// USAGE IN CLIENT WEBSITE
// ─────────────────────────────────────────────────────────────────────────────

/*
// In your client website's server.js or app.js:

import express from "express"

const app = express()

// Initialize on startup
initializeSiteConfig()

// Setup webhook endpoint
setupWebhookEndpoint(app)

// Register webhook with dashboard
registerWebhook()

// OR use polling if webhooks not available
// setupConfigPolling(30000)

app.listen(4000, () => {
  console.log("Client website running on http://localhost:4000")
})
*/

// ─────────────────────────────────────────────────────────────────────────────
// TEMPLATE USAGE (11ty, EJS, Nunjucks, etc.)
// ─────────────────────────────────────────────────────────────────────────────

/*
<!-- In your HTML template -->
<!DOCTYPE html>
<html>
<head>
  <title>{{ siteConfig.company.name }}</title>
  <link rel="stylesheet" href="{{ DASHBOARD_API_URL }}/site-config/css">
  
  <style>
    /* Or embed directly */
    :root {
      --primary: {{ siteConfig.theme.primaryColor }};
      --secondary: {{ siteConfig.theme.secondaryColor }};
    }
  </style>
</head>
<body>
  <header>
    <img src="{{ siteConfig.theme.logoUrl }}" alt="Logo">
    <nav>
      {% for module in availableModules %}
        <a href="{{ module.path }}">{{ module.name }}</a>
      {% endfor %}
    </nav>
  </header>
  
  {% if siteConfig.features.showTestimonials %}
  <section class="testimonials">
    <!-- Testimonials content -->
  </section>
  {% endif %}
  
  <footer>
    <p>{{ siteConfig.company.phone }}</p>
    <p>{{ siteConfig.company.email }}</p>
  </footer>
</body>
</html>
*/

module.exports = {
  initializeSiteConfig,
  registerWebhook,
  setupWebhookEndpoint,
  applySiteConfig,
  setupConfigPolling
}
