# Demo Guide - Simple Payment Request System

## 🚀 Quick Start Demo

### 1. Start the Application
```bash
npm run frontend
```
Then open your browser to: `http://localhost:3001`

### 2. Step-by-Step Walkthrough

#### Step 1: Select a Client
- You'll see 3 sample clients already loaded
- Click on any client to select them (they'll highlight in blue)
- Or click "+ Add New Client" to add a new one
- Fill in: Name, Phone, Email
- Click "Save Client"
- The new client will be automatically selected
- Click "Next Step" to continue

#### Step 2: Select Items
- You'll see a grid of bag products with different colors
- Each item shows:
  - Color indicator (colored circle)
  - Product name (e.g., "Garbage Bags - Blue")
  - Price (e.g., $15.99)
- Click on items to select them (they'll highlight in blue)
- Set quantities using the number input that appears
- You can select multiple items
- Click "Next Step" when ready

#### Step 3: Payment Terms
- Choose from 4 common payment options:
  - **50% Deposit Now** - Client pays 50% upfront
  - **Full Payment on Completion** - Client pays when work is done
  - **Net 30 Days** - Client pays within 30 days
  - **Due on Receipt** - Client pays immediately
- Click on your preferred option (it will highlight)
- Click "Next Step" to continue

#### Step 3: Review & Generate
- Review your payment request summary:
  - Selected client details
  - Payment terms
  - Selected items with quantities and prices
  - Total amount
- Click "Generate PDF" to create the payment request
- The PDF will be saved locally in the `output` folder
- You'll see a success message with details

### 3. Backup All PDFs
- Scroll down to the "Backup All PDFs" section
- Click "Export All PDFs" to see all generated PDFs
- This shows you how many PDFs exist and their names
- All PDFs are automatically saved in the `output` folder

## 🎯 Sample Use Case

**Scenario**: Your mum needs to create a payment request for Sarah Johnson who wants:
- 2 packs of Blue Garbage Bags ($15.99 each)
- 1 pack of Pink Freezer Bags ($12.99)
- 3 packs of Green Garden Bags ($18.99 each)

**Total**: $89.95

**Steps**:
1. Select "Sarah Johnson" as the client
2. Select the 3 items with their quantities
3. Choose "50% Deposit Now" as payment terms
4. Review the summary showing $89.95 total
5. Generate the PDF

## 🔧 Testing the API

You can also test the system programmatically:

### Get All Clients
```bash
curl http://localhost:3001/api/clients
```

### Add New Client
```bash
curl -X POST http://localhost:3001/api/clients \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane Doe","phone":"0400 000 000","email":"jane@example.com"}'
```

### Generate PDF (using the web interface)
- Use the step-by-step interface above
- The PDF will be saved locally

### Export All PDFs
```bash
curl http://localhost:3001/api/export-all-pdfs
```

## 📁 File Locations

- **Generated PDFs**: `./output/` folder
- **Web Interface**: `http://localhost:3001`
- **API Base**: `http://localhost:3001/api/`

## 🎨 Customization Examples

### Add New Product
Edit `public/index.html` and add to the `items` array:
```javascript
{ name: 'Kitchen Bags - Red', price: 14.99, color: '#e74c3c' }
```

### Modify Payment Terms
Edit the payment terms in the HTML to match your business needs.

### Change Colors
Modify the CSS variables in the `<style>` section.

## 🚨 Troubleshooting

### PDF Generation Issues
- Check that the `output` folder exists
- Ensure all steps are completed
- Check browser console for errors

### Server Issues
- Restart with `npm run frontend`
- Check terminal for error messages
- Verify port 3001 is available

### Client Management Issues
- Refresh the page
- Check browser console
- Verify server is running

## ✨ What Makes This Special

1. **Ultra-Simple Interface**: Just 4 clear steps
2. **Visual Selection**: Click to select clients and items
3. **Automatic Calculations**: Totals calculated automatically
4. **Local Storage**: All PDFs saved on your computer
5. **No Database Required**: Simple file-based storage
6. **Mobile Friendly**: Works on phones and tablets
7. **Professional PDFs**: Clean, business-ready output

This system is designed specifically for non-technical users who need to create payment requests quickly and easily!
