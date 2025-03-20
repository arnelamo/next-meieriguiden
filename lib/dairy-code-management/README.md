# Dairy Code Management Module

This module provides tools for managing dairy codes in the Meieriguiden project, including deduplication, cleaning, and API operations.

## Structure

- `DairyCodeManager.js` - Main class for dairy code management
- `update-dairy-codes.js` - CLI script for updating dairy codes
- `data/` - Directory for storing data files
  - `dairycodes_unique.json` - Clean dairy codes without duplicates
  - `duplicate_codes.json` - List of identified duplicate entries
  - `api_response.json` - Response from the API after posting the data

## Usage

### Command Line Interface

```bash
# Basic usage
node update-dairy-codes.js dairycodes_unique.json

# With explicit options
node update-dairy-codes.js --input data/dairycodes_unique.json --token your-admin-token

# Skip API posting (only process locally)
node update-dairy-codes.js --skip-api dairycodes_unique.json

# Show help
node update-dairy-codes.js --help
```

### Options

- `-i, --input <file>` - Input JSON file with dairy codes
- `-t, --token <token>` - Admin token for API authentication
- `-a, --api-url <url>` - API URL for bulk updates
- `-s, --skip-api` - Skip posting to API
- `-h, --help` - Show help message

### Configuration

The module uses a configuration file (`config.json`) to store settings. You can also provide settings via command line arguments.

Example `config.json`:

```json
{
  "apiUrl": "https://api.meieriguiden.no/meierikoder/bulk_update/",
  "dataDir": "./data"
}
```

Note: For security reasons, the admin token is not stored in the config file. You should provide it via the command line argument.

## API Endpoint

The API endpoint for bulk updating dairy codes is:
`https://api.meieriguiden.no/meierikoder/bulk_update/`

This endpoint requires admin authentication with a token.

## Programmatic Usage

You can also use the `DairyCodeManager` class directly in your code:

```javascript
const DairyCodeManager = require("./DairyCodeManager");

// Create a dairy code manager instance
const dairyCodeManager = new DairyCodeManager({
  apiUrl: "https://api.meieriguiden.no/meierikoder/bulk_update/",
  adminToken: "your-admin-token",
  dataDir: "./data",
});

// Process dairy codes
async function updateDairyCodes() {
  await dairyCodeManager.processDairyCodes("path/to/dairycodes_unique.json");
}

updateDairyCodes().catch(console.error);
```
