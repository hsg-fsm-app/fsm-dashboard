import express from "express"
import cors from "cors"
import { 
  defaultSiteConfig, 
  createSiteConfig, 
  generateCSSVariables 
} from "./config/site-config.js"

const app = express()
app.use(cors())
app.use(express.json())

// In-memory config storage (replace with database later)
let siteConfig = createSiteConfig()

// ─────────────────────────────────────────────────────────────────────────────
// CLIENT WEBSITE READS CONFIG
// ─────────────────────────────────────────────────────────────────────────────

/**
 * GET /api/site-config
 * Client website fetches this on page load
 */
app.get("/api/site-config", (req, res) => {
  res.json(siteConfig)
})

/**
 * GET /api/site-config/css
 * Returns CSS variables as a stylesheet
 * Usage: <link rel="stylesheet" href="http://dashboard-api/api/site-config/css">
 */
app.get("/api/site-config/css", (req, res) => {
  const css = generateCSSVariables(siteConfig.theme)
  res.setHeader("Content-Type", "text/css")
  res.send(css)
})

// ─────────────────────────────────────────────────────────────────────────────
// DASHBOARD EDITOR SAVES CHANGES
// ─────────────────────────────────────────────────────────────────────────────

/**
 * POST /api/site-config/save
 * Dashboard "Save Changes" button hits this endpoint
 * Pushes updated config that client websites will fetch
 */
app.post("/api/site-config/save", (req, res) => {
  try {
    // Merge changes into config
    siteConfig = createSiteConfig({
      ...siteConfig,
      ...req.body
    })
    
    // TODO: Save to database
    // await db.siteConfig.save(siteConfig)
    
    // TODO: Trigger rebuild of client website (optional)
    // await triggerWebsiteRebuild()

    res.json({
      success: true,
      message: "Changes saved successfully",
      css: generateCSSVariables(siteConfig.theme)
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Dashboard API running on http://localhost:${PORT}`)
})
