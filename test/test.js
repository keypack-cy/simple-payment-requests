const { PaymentRequest, Client, Project, Item } = require('../src/index.js');
const path = require('path');

async function runTests() {
  console.log('🧪 Testing Payments Request Library...\n');

  try {
    // Create a client
    console.log('1. Creating client...');
    const client = new Client({
      name: 'Acme Corporation',
      email: 'billing@acme.com',
      phone: '+1-555-0123',
      address: '123 Business St, Suite 100, New York, NY 10001',
      company: 'Acme Corporation',
      taxId: '12-3456789',
      paymentTerms: 'Net 30',
      currency: 'USD'
    });
    console.log('✅ Client created:', client.name);

    // Create a project
    console.log('\n2. Creating project...');
    const project = new Project({
      name: 'Website Redesign Project',
      description: 'Complete redesign of corporate website with modern UI/UX',
      startDate: '2024-01-15',
      endDate: '2024-03-15',
      budget: 25000,
      currency: 'USD',
      status: 'active',
      clientId: client.id,
      manager: 'John Smith',
      category: 'Web Development',
      tags: ['design', 'development', 'ui-ux']
    });
    console.log('✅ Project created:', project.name);

    // Create items
    console.log('\n3. Creating items...');
    const items = [
      new Item({
        name: 'UI/UX Design',
        description: 'Complete user interface and experience design',
        quantity: 80,
        unitPrice: 75,
        unit: 'hour',
        category: 'Design Services',
        taxRate: 0
      }),
      new Item({
        name: 'Frontend Development',
        description: 'React.js frontend development and implementation',
        quantity: 120,
        unitPrice: 85,
        unit: 'hour',
        category: 'Development Services',
        taxRate: 0
      }),
      new Item({
        name: 'Backend Development',
        description: 'Node.js backend API development',
        quantity: 60,
        unitPrice: 90,
        unit: 'hour',
        category: 'Development Services',
        taxRate: 0
      }),
      new Item({
        name: 'Project Management',
        description: 'Project coordination and client communication',
        quantity: 40,
        unitPrice: 65,
        unit: 'hour',
        category: 'Management Services',
        taxRate: 0
      })
    ];
    console.log('✅ Items created:', items.length);

    // Create payment request
    console.log('\n4. Creating payment request...');
    const paymentRequest = new PaymentRequest();
    const requestData = paymentRequest.generatePaymentRequestData({
      client: client,
      project: project,
      items: items,
      notes: 'This payment request covers the first phase of the website redesign project. All deliverables have been completed and approved by the client.',
      terms: 'Net 30',
      taxRate: 0,
      discountRate: 0,
      currency: 'USD',
      paymentMethods: ['Bank Transfer', 'Credit Card', 'PayPal'],
      urgency: 'normal'
    });
    console.log('✅ Payment request created:', requestData.requestNumber);

    // Display payment request details
    console.log('\n5. Payment Request Details:');
    console.log('Request Number:', requestData.requestNumber);
    console.log('Client:', requestData.client.name);
    console.log('Project:', requestData.project.name);
    console.log('Subtotal:', `$${requestData.subtotal.toFixed(2)}`);
    console.log('Tax:', `$${requestData.tax.toFixed(2)}`);
    console.log('Total:', `$${requestData.total.toFixed(2)}`);
    console.log('Due Date:', new Date(requestData.dueDate).toLocaleDateString());

    // Generate PDF
    console.log('\n6. Generating PDF...');
    const outputPath = path.join(__dirname, '..', 'output', `${requestData.requestNumber}.pdf`);
    const pdfPath = await paymentRequest.generatePDF(requestData, outputPath);
    console.log('✅ PDF generated:', pdfPath);

    // Test item calculations
    console.log('\n7. Testing item calculations...');
    items.forEach((item, index) => {
      console.log(`Item ${index + 1}: ${item.name}`);
      console.log(`  Quantity: ${item.getQuantityWithUnit()}`);
      console.log(`  Unit Price: ${item.getFormattedUnitPrice()}`);
      console.log(`  Subtotal: ${item.getFormattedSubtotal()}`);
      console.log(`  Total: ${item.getFormattedTotal()}`);
    });

    // Test project methods
    console.log('\n8. Testing project methods...');
    console.log('Project Duration:', project.getFormattedDuration());
    console.log('Project Progress:', `${project.getProgress()}%`);
    console.log('Is Overdue:', project.isOverdue());
    console.log('Days Until Deadline:', project.getDaysUntilDeadline());

    // Test client methods
    console.log('\n9. Testing client methods...');
    console.log('Full Address:', client.getFullAddress());
    console.log('Contact Info:', client.getContactInfo());
    
    const validation = client.validate();
    console.log('Client Validation:', validation.isValid ? '✅ Valid' : '❌ Invalid');
    if (!validation.isValid) {
      console.log('Errors:', validation.errors);
    }

    // Test payment request methods
    console.log('\n10. Testing payment request methods...');
    const allRequests = paymentRequest.getAllPaymentRequests();
    console.log('Total Payment Requests:', allRequests.length);
    
    const foundRequest = paymentRequest.getPaymentRequest(requestData.id);
    console.log('Found Request:', foundRequest ? foundRequest.requestNumber : 'Not found');

    // Update status
    const updatedRequest = paymentRequest.updateStatus(requestData.id, 'approved');
    console.log('Updated Status:', updatedRequest.status);

    console.log('\n🎉 All tests completed successfully!');
    console.log(`📄 PDF saved to: ${pdfPath}`);

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error(error.stack);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests();
}

module.exports = { runTests };
