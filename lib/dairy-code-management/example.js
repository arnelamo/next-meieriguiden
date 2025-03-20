/**
 * Example script demonstrating how to use the DairyCodeManager class
 */

const path = require("path");
const DairyCodeManager = require("./DairyCodeManager");

// Create a dairy code manager instance
const dairyCodeManager = new DairyCodeManager({
  apiUrl: "https://api.meieriguiden.no/meierikoder/bulk_update/",
  adminToken: "your-admin-token", // Replace with your actual token
  dataDir: path.join(__dirname, "data"),
});

// Example 1: Process dairy codes (deduplicate, clean, and post to API)
async function example1() {
  console.log("Example 1: Process dairy codes");
  try {
    await dairyCodeManager.processDairyCodes(
      path.join(__dirname, "data", "dairycodes_unique.json"),
    );
  } catch (error) {
    console.error("Error:", error.message);
  }
}

// Example 2: Process dairy codes without posting to API
async function example2() {
  console.log("\nExample 2: Process dairy codes without posting to API");
  try {
    // Load dairy codes
    const dairyCodes = dairyCodeManager.loadDairyCodes(
      path.join(__dirname, "data", "dairycodes_unique.json"),
    );

    // Remove duplicates
    const { uniqueDairyCodes, duplicates } = dairyCodeManager.removeDuplicates(dairyCodes);
    console.log(`Found ${duplicates.length} duplicates out of ${dairyCodes.length} dairy codes`);

    // Clean place field
    const cleanedDairyCodes = dairyCodeManager.cleanPlaceField(uniqueDairyCodes);

    // Save cleaned data
    dairyCodeManager.saveDairyCodes(
      cleanedDairyCodes,
      path.join(__dirname, "data", "example_output.json"),
    );

    // Generate statistics
    dairyCodeManager.generateBovaerStats(cleanedDairyCodes);
  } catch (error) {
    console.error("Error:", error.message);
  }
}

// Run the examples
// Uncomment the example you want to run
// example1();
example2();
