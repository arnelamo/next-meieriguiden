#!/usr/bin/env node

/**
 * update-dairy-codes.js
 * CLI script for updating dairy codes using the DairyCodeManager class.
 */

const path = require("path");
const fs = require("fs");
const DairyCodeManager = require("./DairyCodeManager");

// Default configuration
const DEFAULT_CONFIG = {
  apiUrl: "https://api.meieriguiden.no/meierikoder/bulk_update/",
  adminToken: "", // Will be loaded from config file or prompted
  dataDir: path.join(__dirname, "data"),
};

// Config file path
const CONFIG_FILE_PATH = path.join(__dirname, "config.json");

/**
 * Load configuration from file or use defaults
 * @returns {Object} - Configuration object
 */
function loadConfig() {
  try {
    if (fs.existsSync(CONFIG_FILE_PATH)) {
      const configData = fs.readFileSync(CONFIG_FILE_PATH, "utf8");
      const config = JSON.parse(configData);
      return { ...DEFAULT_CONFIG, ...config };
    }
  } catch (error) {
    console.error("Error loading config file:", error.message);
  }

  return DEFAULT_CONFIG;
}

/**
 * Save configuration to file
 * @param {Object} config - Configuration object
 */
function saveConfig(config) {
  try {
    // Don't save the admin token to the config file for security
    const configToSave = { ...config };
    delete configToSave.adminToken;

    fs.writeFileSync(CONFIG_FILE_PATH, JSON.stringify(configToSave, null, 2));
    console.log("Configuration saved to", CONFIG_FILE_PATH);
  } catch (error) {
    console.error("Error saving config file:", error.message);
  }
}

/**
 * Parse command line arguments
 * @returns {Object} - Parsed arguments
 */
function parseArgs() {
  const args = process.argv.slice(2);
  const parsedArgs = {
    inputFile: null,
    adminToken: null,
    apiUrl: null,
    skipApi: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === "--input" || arg === "-i") {
      parsedArgs.inputFile = args[++i];
    } else if (arg === "--token" || arg === "-t") {
      parsedArgs.adminToken = args[++i];
    } else if (arg === "--api-url" || arg === "-a") {
      parsedArgs.apiUrl = args[++i];
    } else if (arg === "--skip-api" || arg === "-s") {
      parsedArgs.skipApi = true;
    } else if (arg === "--help" || arg === "-h") {
      showHelp();
      process.exit(0);
    } else if (!parsedArgs.inputFile) {
      // Assume the first non-flag argument is the input file
      parsedArgs.inputFile = arg;
    }
  }

  return parsedArgs;
}

/**
 * Show help message
 */
function showHelp() {
  console.log(`
Usage: node update-dairy-codes.js [options] <input-file>

Options:
  -i, --input <file>    Input JSON file with dairy codes
  -t, --token <token>   Admin token for API authentication
  -a, --api-url <url>   API URL for bulk updates
  -s, --skip-api        Skip posting to API
  -h, --help            Show this help message

Examples:
  node update-dairy-codes.js dairycodes.json
  node update-dairy-codes.js --input dairycodes.json --token your-token
  node update-dairy-codes.js --skip-api dairycodes.json
  `);
}

/**
 * Main function
 */
async function main() {
  // Load config
  const config = loadConfig();

  // Parse command line arguments
  const args = parseArgs();

  // Update config with command line arguments
  if (args.adminToken) config.adminToken = args.adminToken;
  if (args.apiUrl) config.apiUrl = args.apiUrl;

  // Check for required input file
  if (!args.inputFile) {
    console.error("Error: Input file is required");
    showHelp();
    process.exit(1);
  }

  // Check for admin token if not skipping API
  if (!args.skipApi && !config.adminToken) {
    console.error("Error: Admin token is required for API operations");
    console.error("Use --token option or add it to the config file");
    process.exit(1);
  }

  // Save updated config
  saveConfig(config);

  // Create dairy code manager
  const dairyCodeManager = new DairyCodeManager(config);

  // Process dairy codes
  try {
    if (args.skipApi) {
      // Only process locally without API posting
      const dairyCodes = dairyCodeManager.loadDairyCodes(args.inputFile);
      if (dairyCodes.length === 0) {
        console.error("No dairy codes to process. Exiting.");
        return;
      }

      const { uniqueDairyCodes } = dairyCodeManager.removeDuplicates(dairyCodes);
      const cleanedDairyCodes = dairyCodeManager.cleanPlaceField(uniqueDairyCodes);

      dairyCodeManager.saveDairyCodes(
        cleanedDairyCodes,
        path.join(config.dataDir, "dairycodes_unique.json"),
      );

      dairyCodeManager.generateBovaerStats(cleanedDairyCodes);
      console.log("Dairy codes processing completed successfully (API posting skipped).");
    } else {
      // Full processing including API posting
      await dairyCodeManager.processDairyCodes(args.inputFile);
    }
  } catch (error) {
    console.error("Error processing dairy codes:", error.message);
    process.exit(1);
  }
}

// Run the main function
main().catch((error) => {
  console.error("Unhandled error:", error);
  process.exit(1);
});
