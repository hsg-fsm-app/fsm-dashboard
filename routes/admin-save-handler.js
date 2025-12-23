// ─────────────────────────────────────────────────────────────────────────────
// DASHBOARD "SAVE CHANGES" BUTTON HANDLER
// Simple flow: Edit → Save Button → API → Client site updates
// ─────────────────────────────────────────────────────────────────────────────

/**
 * SIMPLE FLOW:
 * 
 * User edits colors/toggles in dashboard
 *           ↓
 * Clicks "Save Changes" button
 *           ↓
 * POST to /api/site-config/save
 *           ↓
 * Config saved to dashboard server
 *           ↓
 * Client website fetches on next page load
 */

const DASHBOARD_API = "http://localhost:3000/api"

// ─────────────────────────────────────────────────────────────────────────────
// FRONTEND: Save Button Click Handler
// ─────────────────────────────────────────────────────────────────────────────

document.getElementById("save-theme-btn")?.addEventListener("click", async () => {
  const btn = event.target
  btn.disabled = true
  btn.textContent = "Saving..."

  try {
    // Collect all form data from dashboard
    const config = {
      theme: {
        primaryColor: document.querySelector('[data-css-var="--primary"]').value,
        secondaryColor: document.querySelector('[data-css-var="--secondary"]').value,
        accentColor: document.querySelector('[data-css-var="--headerColor"]').value,
      },
      company: {
        name: document.querySelector('input[placeholder="Enter company name"]').value,
        phone: document.querySelector('input[placeholder="Enter phone number"]').value,
        email: document.querySelector('input[placeholder="Enter email"]').value,
        address: document.querySelector('input[placeholder="Enter address"]').value,
      },
      modules: collectModuleToggles(),
      features: collectFeatureToggles(),
    }

    // Send to API
    const response = await fetch(`${DASHBOARD_API}/site-config/save`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(config)
    })

    const result = await response.json()

    if (result.success) {
      showNotification("✓ Changes saved successfully!", "success")
      btn.textContent = "Saved!"
      setTimeout(() => {
        btn.textContent = "Save Changes"
        btn.disabled = false
      }, 2000)
    } else {
      throw new Error(result.error)
    }
  } catch (error) {
    showNotification("Failed to save changes: " + error.message, "error")
    btn.textContent = "Save Changes"
    btn.disabled = false
  }
})

// ─────────────────────────────────────────────────────────────────────────────
// Helper Functions
// ─────────────────────────────────────────────────────────────────────────────

function collectModuleToggles() {
  const modules = {}
  document.querySelectorAll(".cs-feature-card").forEach(card => {
    const moduleKey = card.dataset.moduleKey // Add data-module-key to each card
    const toggle = card.querySelector(".cs-toggle-button")
    const enabled = toggle?.classList.contains("cs-enabled")
    
    if (moduleKey) {
      modules[moduleKey] = { enabled }
    }
  })
  return modules
}

function collectFeatureToggles() {
  return {
    showTestimonials: document.getElementById("toggle-testimonials")?.checked ?? true,
    showPricing: document.getElementById("toggle-pricing")?.checked ?? true,
    showServiceArea: document.getElementById("toggle-service-area")?.checked ?? true,
    stickyCallButton: document.getElementById("toggle-sticky-call")?.checked ?? true,
    onlineBooking: document.getElementById("toggle-booking")?.checked ?? true,
    emergencyService: document.getElementById("toggle-emergency")?.checked ?? false,
  }
}

function showNotification(message, type = "info") {
  const notification = document.createElement("div")
  notification.className = `cs-notification cs-${type}`
  notification.textContent = message
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 16px 24px;
    background: ${type === "success" ? "#10b981" : "#ef4444"};
    color: white;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 99999;
    animation: slideIn 0.3s ease;
  `
  
  document.body.appendChild(notification)
  
  setTimeout(() => {
    notification.style.animation = "slideOut 0.3s ease"
    setTimeout(() => notification.remove(), 300)
  }, 3000)
}

// ─────────────────────────────────────────────────────────────────────────────
// CLIENT WEBSITE: Fetch Config on Page Load
// ─────────────────────────────────────────────────────────────────────────────

/**
 * On the CLIENT WEBSITE (not dashboard), add this to fetch latest config:
 */

// <script>
//   fetch("http://localhost:3000/api/site-config")
//     .then(res => res.json())
//     .then(config => {
//       // Apply CSS variables
//       document.documentElement.style.setProperty("--primary", config.theme.primaryColor)
//       document.documentElement.style.setProperty("--secondary", config.theme.secondaryColor)
//       document.documentElement.style.setProperty("--headerColor", config.theme.accentColor)
//       
//       // Or just link to the CSS endpoint
//       // <link rel="stylesheet" href="http://localhost:3000/api/site-config/css">
//     })
// </script>

// ─────────────────────────────────────────────────────────────────────────────
// EVEN SIMPLER: Static CSS Link in Client Website
// ─────────────────────────────────────────────────────────────────────────────

/**
 * In your client website's HTML, just add:
 * 
 * <link rel="stylesheet" href="http://localhost:3000/api/site-config/css">
 * 
 * Browser will cache it, and when user hits refresh after saving changes,
 * they'll see the new colors instantly!
 */
