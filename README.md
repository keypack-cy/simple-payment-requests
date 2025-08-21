# Simple Payment Request System

A user-friendly payment request generator designed for non-technical users to easily create professional payment requests for clients.

## Features

- **Step-by-step interface** - Simple 4-step process
- **Client management** - Add and manage client information
- **Pre-defined items** - Garbage bags, freezer bags, and garden bags in various colors
- **Payment terms** - Common payment options like 50% deposit, net 30, etc.
- **PDF export** - Generate professional payment request PDFs
- **Local storage** - All PDFs saved locally for easy access
- **Backup option** - Export all PDFs for backup purposes

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone or download this project
2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

1. Start the server:
   ```bash
   npm run frontend
   ```

2. Open your browser and go to: `http://localhost:3001`

## How to Use

### Step 1: Select a Client
- Choose from existing clients or add a new one
- Click the "+ Add New Client" button to add client details
- Select a client to proceed to the next step

### Step 2: Select Items
- Choose from the available bag types:
  - Garbage Bags (Blue, Green, Pink, Brown) - $15.99
  - Freezer Bags (Blue, Green, Pink, Brown) - $12.99
  - Garden Bags (Blue, Green, Pink, Brown) - $18.99
- Click on items to select them
- Set quantities for each selected item

### Step 3: Payment Terms
- Select from common payment options:
  - 50% Deposit Now
  - Full Payment on Completion
  - Net 30 Days
  - Due on Receipt

### Step 4: Review & Generate
- Review your payment request summary
- Click "Generate PDF" to create the payment request
- PDF will be saved locally in the `output` folder

### Backup All PDFs
- Use the "Export All PDFs" button to see all generated PDFs
- All PDFs are automatically saved in the `output` folder

## File Structure

```
payments-request/
├── public/
│   └── index.html          # Main user interface
├── src/
│   ├── Client.js           # Client management
│   ├── Item.js             # Item definitions
│   ├── PaymentRequest.js   # PDF generation logic
│   ├── Project.js          # Project management
│   └── index.js            # Main exports
├── output/                 # Generated PDFs folder
├── server.js               # Express server
└── package.json            # Dependencies
```

## API Endpoints

- `GET /` - Main application interface
- `GET /api/health` - Server health check
- `GET /api/clients` - Get all clients
- `POST /api/clients` - Add new client
- `POST /api/generate-pdf` - Generate payment request PDF
- `GET /api/export-all-pdfs` - Get list of all generated PDFs

## Customization

### Adding New Items
Edit the `items` array in `public/index.html` to add new products or modify existing ones.

### Modifying Payment Terms
Edit the payment terms options in the HTML to match your business needs.

### Styling
The interface uses CSS with a modern, responsive design. Colors and styling can be customized in the `<style>` section of the HTML file.

## Troubleshooting

### PDF Generation Issues
- Ensure the `output` folder exists and is writable
- Check that all required fields are filled in
- Verify the server is running without errors

### Client Management Issues
- Refresh the page if clients don't load
- Check browser console for error messages
- Ensure the server is running and accessible

## Support

This system is designed to be simple and intuitive. If you encounter issues:

1. Check that all steps are completed before proceeding
2. Ensure all required fields are filled in
3. Check the browser console for error messages
4. Restart the server if needed

## Future Enhancements

- Database integration for persistent client storage
- Email functionality to send PDFs directly to clients
- Multiple currency support
- Tax calculation options
- Invoice numbering system
- Payment tracking
