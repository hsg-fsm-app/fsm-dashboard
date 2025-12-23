// ─────────────────────────────────────────────────────────────────────────────
// SITE CONFIG CONTRACT - Single Source of Truth
// Shared schema between FSM Dashboard and client-facing websites
// ─────────────────────────────────────────────────────────────────────────────

const defaultSiteConfig = {
  // ─────────────────────────────────────────────────────────────────────────
  // THEME / BRAND COLORS
  // Maps to CSS variables: --primary, --secondary, --headerColor
  // ─────────────────────────────────────────────────────────────────────────
  theme: {
    primaryColor: "#ff6a3e",
    secondaryColor: "#ffba43",
    accentColor: "#1a1a1a",
    logoUrl: "/assets/images/logo.svg",
    logoDarkUrl: "/assets/images/logo-dark.svg",
    faviconUrl: "/favicon.ico",
  },

  // ─────────────────────────────────────────────────────────────────────────
  // COMPANY INFORMATION
  // ─────────────────────────────────────────────────────────────────────────
  company: {
    name: "Your Company Name",
    phone: "(555) 123-4567",
    email: "info@company.com",
    address: "123 Main St, City, ST 12345",
  },

  // ─────────────────────────────────────────────────────────────────────────
  // FEATURE MODULES
  // Active modules that can be toggled on/off from the admin dashboard
  // ─────────────────────────────────────────────────────────────────────────
  modules: {
    // Active Feature Modules
    projectEstimator: {
      enabled: true,
      locked: false,
      path: "/estimator/",
      name: "Project Estimator",
      description: "Interactive tool for customers to estimate project costs and requirements.",
    },
    clientPortal: {
      enabled: true,
      locked: false,
      path: "/portal/",
      name: "Client Portal",
      description: "Secure messaging system for customer communication and support.",
    },
    jobManagement: {
      enabled: true,
      locked: false,
      path: "/jobs/",
      name: "Job Management",
      description: "Complete project tracking system with timelines and progress monitoring.",
    },
    crm: {
      enabled: true,
      locked: false,
      path: "/crm/",
      name: "CRM System",
      description: "Customer relationship management with interaction tracking and follow-ups.",
    },

    // Locked Feature Modules (require unlock/upgrade)
    advancedAnalytics: {
      enabled: false,
      locked: true,
      path: "/analytics/",
      name: "Advanced Analytics",
      description: "Comprehensive business insights, reports, and performance dashboards.",
    },
    emailMarketing: {
      enabled: false,
      locked: true,
      path: "/email-marketing/",
      name: "Email Marketing",
      description: "Automated email campaigns and customer engagement tools.",
    },
    scheduling: {
      enabled: false,
      locked: true,
      path: "/scheduling/",
      name: "Scheduling & Calendar",
      description: "Integrated calendar system for appointments and team scheduling.",
    },
    invoicing: {
      enabled: false,
      locked: true,
      path: "/invoicing/",
      name: "Invoice & Payments",
      description: "Automated invoicing and online payment processing system.",
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // SITE FEATURES (Legacy toggles for website sections)
  // ─────────────────────────────────────────────────────────────────────────
  features: {
    showTestimonials: true,
    showPricing: true,
    showServiceArea: true,
    stickyCallButton: true,
    onlineBooking: true,
    emergencyService: false,
  },

  // ─────────────────────────────────────────────────────────────────────────
  // CONTENT SECTIONS METADATA
  // ─────────────────────────────────────────────────────────────────────────
  content: {
    homepage: {
      lastUpdated: null,
      sections: ["hero", "services", "testimonials"],
    },
    blog: {
      lastUpdated: null,
      publishedCount: 0,
    },
    gallery: {
      lastUpdated: null,
      projectCount: 0,
    },
    reviews: {
      lastUpdated: null,
      testimonialCount: 0,
    },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// UTILITY FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Get count of active (enabled & unlocked) modules
 * @param {Object} config - Site config object
 * @returns {number}
 */
function getActiveModuleCount(config) {
  return Object.values(config.modules).filter(m => m.enabled && !m.locked).length;
}

/**
 * Get all enabled modules
 * @param {Object} config - Site config object
 * @returns {Object[]}
 */
function getEnabledModules(config) {
  return Object.entries(config.modules)
    .filter(([_, m]) => m.enabled && !m.locked)
    .map(([key, m]) => ({ key, ...m }));
}

/**
 * Get all locked modules
 * @param {Object} config - Site config object
 * @returns {Object[]}
 */
function getLockedModules(config) {
  return Object.entries(config.modules)
    .filter(([_, m]) => m.locked)
    .map(([key, m]) => ({ key, ...m }));
}

/**
 * Toggle a module's enabled state
 * @param {Object} config - Site config object
 * @param {string} moduleKey - Module key to toggle
 * @returns {Object} Updated config
 */
function toggleModule(config, moduleKey) {
  if (config.modules[moduleKey] && !config.modules[moduleKey].locked) {
    return {
      ...config,
      modules: {
        ...config.modules,
        [moduleKey]: {
          ...config.modules[moduleKey],
          enabled: !config.modules[moduleKey].enabled,
        },
      },
    };
  }
  return config;
}

/**
 * Generates CSS custom properties from theme config
 * @param {Object} theme - Theme config object
 * @returns {string} CSS custom properties block
 */
function generateCSSVariables(theme) {
  return `:root {
  --primary: ${theme.primaryColor};
  --secondary: ${theme.secondaryColor};
  --headerColor: ${theme.accentColor};
}`;
}

/**
 * Deep merge utility for configs
 * @param {Object} target
 * @param {Object} source
 * @returns {Object}
 */
function mergeConfig(target, source) {
  const output = { ...target };
  for (const key in source) {
    if (source[key] && typeof source[key] === "object" && !Array.isArray(source[key])) {
      output[key] = mergeConfig(target[key] || {}, source[key]);
    } else {
      output[key] = source[key];
    }
  }
  return output;
}

/**
 * Create a site config with custom overrides
 * @param {Object} overrides - Custom config values
 * @returns {Object} Merged config
 */
function createSiteConfig(overrides = {}) {
  return mergeConfig(defaultSiteConfig, overrides);
}

// ─────────────────────────────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

export {
  defaultSiteConfig,
  createSiteConfig,
  getActiveModuleCount,
  getEnabledModules,
  getLockedModules,
  toggleModule,
  generateCSSVariables,
  mergeConfig,
};
