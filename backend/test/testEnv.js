 import 'dotenv/config'
 console.log("=== Environment Variables Check ===");

// List the variables you want to confirm
const requiredVars = [
  "PORT",
  "NODE_ENV",
  "CORS_ORIGIN",
  "MAX_FILE_SIZE",
  "CLEANUP_INTERVAL",
  "EMAIL_USER",
  "EMAIL_PASSWORD",
  "CONTACT_EMAIL",
  "SITE_NAME",
  "LIBREOFFICE_PATH",
  "POPPLER_PATH"
];

requiredVars.forEach(v => {
  console.log(`${v}:`, process.env[v] || "❌ Not set");
});

console.log("=== End of Check ===");