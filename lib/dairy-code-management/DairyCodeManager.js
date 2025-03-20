/**
 * DairyCodeManager.js
 * A class for managing dairy codes, including deduplication and API operations.
 */

const fs = require("fs");
const axios = require("axios");
const path = require("path");

class DairyCodeManager {
  /**
   * Constructor for the DairyCodeManager class
   * @param {Object} config - Configuration options
   * @param {string} config.apiUrl - The API URL for bulk updates
   * @param {string} config.adminToken - The admin token for API authentication
   * @param {string} config.dataDir - Directory to store data files (default: './data')
   */
  constructor(config) {
    this.apiUrl = config.apiUrl;
    this.adminToken = config.adminToken;
    this.dataDir = config.dataDir || path.join(__dirname, "data");

    // Ensure data directory exists
    if (!fs.existsSync(this.dataDir)) {
      fs.mkdirSync(this.dataDir, { recursive: true });
    }
  }

  /**
   * Load dairy codes from a JSON file
   * @param {string} filePath - Path to the JSON file
   * @returns {Array} - Array of dairy code objects
   */
  loadDairyCodes(filePath) {
    try {
      const data = fs.readFileSync(filePath, "utf8");
      const dairyCodes = JSON.parse(data);
      console.log(`Loaded ${dairyCodes.length} dairy codes from ${filePath}`);
      return dairyCodes;
    } catch (error) {
      console.error(`Error loading dairy codes from ${filePath}:`, error.message);
      return [];
    }
  }

  /**
   * Save dairy codes to a JSON file
   * @param {Array} dairyCodes - Array of dairy code objects
   * @param {string} filePath - Path to save the JSON file
   */
  saveDairyCodes(dairyCodes, filePath) {
    try {
      fs.writeFileSync(filePath, JSON.stringify(dairyCodes, null, 2));
      console.log(`Saved ${dairyCodes.length} dairy codes to ${filePath}`);
    } catch (error) {
      console.error(`Error saving dairy codes to ${filePath}:`, error.message);
    }
  }

  /**
   * Remove duplicate dairy codes based on the code field
   * @param {Array} dairyCodes - Array of dairy code objects
   * @returns {Object} - Object containing unique dairy codes and duplicates
   */
  removeDuplicates(dairyCodes) {
    console.log(`Processing ${dairyCodes.length} dairy codes to remove duplicates...`);

    const uniqueCodeMap = new Map();
    const duplicates = [];

    dairyCodes.forEach((dairyCode) => {
      if (uniqueCodeMap.has(dairyCode.code)) {
        duplicates.push({
          code: dairyCode.code,
          first: uniqueCodeMap.get(dairyCode.code),
          second: dairyCode,
        });
        console.log(`Found duplicate for code ${dairyCode.code}: ${dairyCode.name}`);
      } else {
        uniqueCodeMap.set(dairyCode.code, dairyCode);
      }
    });

    const uniqueDairyCodes = Array.from(uniqueCodeMap.values());

    console.log(`Unique dairy codes: ${uniqueDairyCodes.length}`);
    console.log(`Removed duplicates: ${duplicates.length}`);

    // Save duplicates for reference
    if (duplicates.length > 0) {
      this.saveDairyCodes(duplicates, path.join(this.dataDir, "duplicate_codes.json"));
    }

    return {
      uniqueDairyCodes,
      duplicates,
    };
  }

  /**
   * Generate statistics about uses_bovaer values
   * @param {Array} dairyCodes - Array of dairy code objects
   * @returns {Object} - Statistics object
   */
  generateBovaerStats(dairyCodes) {
    const bovaerStats = {};

    dairyCodes.forEach((dairyCode) => {
      const value = dairyCode.uses_bovaer.toLowerCase();
      bovaerStats[value] = (bovaerStats[value] || 0) + 1;
    });

    console.log("\nuses_bovaer statistics:");
    Object.entries(bovaerStats).forEach(([value, count]) => {
      console.log(`${value}: ${count}`);
    });

    return bovaerStats;
  }

  /**
   * Clean the place field in dairy codes
   * @param {Array} dairyCodes - Array of dairy code objects
   * @returns {Array} - Cleaned dairy codes
   */
  cleanPlaceField(dairyCodes) {
    return dairyCodes.map((dairyCode) => {
      // Remove post numbers from place field
      let place = dairyCode.place;

      // Remove everything after and including a comma
      if (place && place.includes(",")) {
        place = place.split(",")[0].trim();
      }

      return {
        ...dairyCode,
        place,
      };
    });
  }

  /**
   * Post dairy codes to the API
   * @param {Array} dairyCodes - Array of dairy code objects to post
   * @returns {Promise} - Promise resolving to the API response
   */
  async postToApi(dairyCodes) {
    console.log(`Posting ${dairyCodes.length} dairy codes to API...`);

    try {
      const response = await axios.post(this.apiUrl, dairyCodes, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${this.adminToken}`,
        },
      });

      console.log("API Response:", response.status, response.statusText);
      console.log("Summary:", response.data);

      // Save the API response to a file
      this.saveApiResponse(response.data);

      return response.data;
    } catch (error) {
      console.error("Error posting to API:", error.message);

      if (error.response) {
        console.error("Response status:", error.response.status);
        console.error("Response data:", error.response.data);

        // Save error details to a file
        this.saveApiError(error.response);
      }

      throw error;
    }
  }

  /**
   * Save API response to a file
   * @param {Object} responseData - API response data
   */
  saveApiResponse(responseData) {
    try {
      fs.writeFileSync(
        path.join(this.dataDir, "api_response.json"),
        JSON.stringify(responseData, null, 2),
      );
      console.log("API response saved to api_response.json");
    } catch (error) {
      console.error("Error saving API response:", error.message);
    }
  }

  /**
   * Save API error to a file
   * @param {Object} errorResponse - API error response
   */
  saveApiError(errorResponse) {
    try {
      fs.writeFileSync(
        path.join(this.dataDir, "api_error.json"),
        JSON.stringify(
          {
            status: errorResponse.status,
            data: errorResponse.data,
          },
          null,
          2,
        ),
      );
      console.error("Error details saved to api_error.json");
    } catch (error) {
      console.error("Error saving API error details:", error.message);
    }
  }

  /**
   * Process dairy codes: load, deduplicate, clean, and post to API
   * @param {string} inputFilePath - Path to the input JSON file
   * @returns {Promise} - Promise resolving when the process is complete
   */
  async processDairyCodes(inputFilePath) {
    // Load dairy codes
    const dairyCodes = this.loadDairyCodes(inputFilePath);
    if (dairyCodes.length === 0) {
      console.error("No dairy codes to process. Exiting.");
      return;
    }

    // Remove duplicates
    const { uniqueDairyCodes } = this.removeDuplicates(dairyCodes);

    // Clean place field
    const cleanedDairyCodes = this.cleanPlaceField(uniqueDairyCodes);

    // Save cleaned data
    this.saveDairyCodes(cleanedDairyCodes, path.join(this.dataDir, "dairycodes_unique.json"));

    // Generate statistics
    this.generateBovaerStats(cleanedDairyCodes);

    // Post to API
    try {
      await this.postToApi(cleanedDairyCodes);
      console.log("Dairy codes processing completed successfully.");
    } catch (error) {
      console.error("Dairy codes processing failed during API posting.");
    }
  }
}

module.exports = DairyCodeManager;
