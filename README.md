# OData Metadata Parser

A Next.js application that parses OData metadata XML and converts it to JSON objects.

## Features

- Parse OData metadata XML from SAP
- Convert Actions and Functions to JSON format
- Display entity structures as JSON objects
- Support for navigation properties and referential constraints

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Usage

1. Paste your OData metadata XML into the textarea
2. Click "Parse Metadata" 
3. View the parsed results:
   - **Actions (POST)**: Shows parameters and return types
   - **Functions (GET)**: Shows return types
   - **Entities**: Shows all entity properties as JSON objects

## Example Output

For the provided Northwind metadata, you'll get:

### Actions (POST)
- `discontinue`: Parameters with entity structure, returns Product entity
- `submitOrder`: Parameters with product ID and quantity, returns integer

### Functions (GET)  
- `randomProduct`: Returns Product entity structure

### Entities
- Products, Suppliers, Categories with all properties and navigation relationships

## License

MIT License

## Author

Created by Rangga Eka

## Credits

- Built with [Next.js](https://nextjs.org/)
- Uses [@sap-ux/edmx-parser](https://www.npmjs.com/package/@sap-ux/edmx-parser) for OData metadata parsing