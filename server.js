const express = require('express');
const path = require('path');
const fs = require('fs-extra');
const { PaymentRequest, Client, Project, Item } = require('./src/index.js');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Payments Request API is running' });
});

// Get all clients
app.get('/api/clients', (req, res) => {
  try {
    // In a real app, this would come from a database
    const clients = [
      { name: 'John Smith', phone: '0412 345 678', email: 'john@example.com' },
      { name: 'Sarah Johnson', phone: '0423 456 789', email: 'sarah@example.com' },
      { name: 'Mike Wilson', phone: '0434 567 890', email: 'mike@example.com' }
    ];
    
    res.json({
      success: true,
      data: clients
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to get clients', 
      details: error.message 
    });
  }
});

// Add new client
app.post('/api/clients', (req, res) => {
  try {
    const { name, phone, email } = req.body;
    
    if (!name || !phone || !email) {
      return res.status(400).json({ 
        error: 'Missing required fields: name, phone, and email are required' 
      });
    }

    // In a real app, this would save to a database
    const newClient = { name, phone, email };
    
    res.json({
      success: true,
      message: 'Client added successfully',
      data: newClient
    });

  } catch (error) {
    console.error('Error adding client:', error);
    res.status(500).json({ 
      error: 'Failed to add client', 
      details: error.message 
    });
  }
});

// Generate payment request PDF
app.post('/api/generate-pdf', async (req, res) => {
  try {
    const { client, project, items, options } = req.body;
    
    // Validate required data
    if (!client || !project || !items || !Array.isArray(items)) {
      return res.status(400).json({ 
        error: 'Missing required data: client, project, and items array are required' 
      });
    }

    // Create instances
    const clientInstance = new Client(client);
    const projectInstance = new Project(project);
    const itemInstances = items.map(item => new Item(item));

    // Generate payment request
    const paymentRequest = new PaymentRequest();
    const requestData = paymentRequest.generatePaymentRequestData({
      client: clientInstance,
      project: projectInstance,
      items: itemInstances,
      ...options
    });

    // Generate PDF
    const outputPath = path.join(__dirname, 'output', `${requestData.requestNumber}.pdf`);
    const pdfPath = await paymentRequest.generatePDF(requestData, outputPath);

    res.json({
      success: true,
      message: 'PDF generated successfully',
      data: {
        requestNumber: requestData.requestNumber,
        pdfPath: pdfPath,
        total: requestData.total,
        dueDate: requestData.dueDate
      }
    });

  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({ 
      error: 'Failed to generate PDF', 
      details: error.message 
    });
  }
});

// Export all PDFs
app.get('/api/export-all-pdfs', async (req, res) => {
  try {
    const outputDir = path.join(__dirname, 'output');
    
    // Check if output directory exists
    if (!await fs.pathExists(outputDir)) {
      return res.status(404).json({ 
        error: 'No PDFs found. Generate some payment requests first.' 
      });
    }

    // Get all PDF files
    const files = await fs.readdir(outputDir);
    const pdfFiles = files.filter(file => file.endsWith('.pdf'));
    
    if (pdfFiles.length === 0) {
      return res.status(404).json({ 
        error: 'No PDFs found. Generate some payment requests first.' 
      });
    }

    // Create a simple zip-like structure (in a real app, you'd use a proper zip library)
    const exportData = {
      totalFiles: pdfFiles.length,
      files: pdfFiles.map(file => ({
        name: file,
        path: path.join(outputDir, file),
        size: fs.statSync(path.join(outputDir, file)).size
      })),
      exportDate: new Date().toISOString()
    };

    res.json({
      success: true,
      message: `Found ${pdfFiles.length} PDF files for export`,
      data: exportData
    });

  } catch (error) {
    console.error('Error exporting PDFs:', error);
    res.status(500).json({ 
      error: 'Failed to export PDFs', 
      details: error.message 
    });
  }
});

// Serve PDF files
app.get('/api/pdf/:filename', (req, res) => {
  try {
    const { filename } = req.params;
    const pdfPath = path.join(__dirname, 'output', filename);
    
    // Check if file exists
    if (!fs.existsSync(pdfPath)) {
      return res.status(404).json({ error: 'PDF not found' });
    }
    
    // Serve the PDF file
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
    res.sendFile(pdfPath);
    
  } catch (error) {
    console.error('Error serving PDF:', error);
    res.status(500).json({ 
      error: 'Failed to serve PDF', 
      details: error.message 
    });
  }
});

// Get payment request by ID
app.get('/api/payment-request/:id', (req, res) => {
  try {
    const { id } = req.params;
    const paymentRequest = new PaymentRequest();
    
    // For demo purposes, create a sample request
    const sampleClient = new Client({
      name: 'Sample Client',
      email: 'client@example.com'
    });
    
    const sampleProject = new Project({
      name: 'Sample Project',
      description: 'A sample project for demonstration'
    });
    
    const sampleItems = [
      new Item({
        name: 'Sample Service',
        description: 'A sample service item',
        quantity: 1,
        unitPrice: 100
      })
    ];
    
    const requestData = paymentRequest.generatePaymentRequestData({
      client: sampleClient,
      project: sampleProject,
      items: sampleItems
    });
    
    res.json({
      success: true,
      data: requestData
    });

  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to get payment request', 
      details: error.message 
    });
  }
});

// Serve the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Serve bags.json
app.get('/bags.json', (req, res) => {
  res.sendFile(path.join(__dirname, 'bags.json'));
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Payments Request Server running on http://localhost:${PORT}`);
  console.log(`📚 API Documentation available at http://localhost:${PORT}/api/health`);
});

module.exports = app;
