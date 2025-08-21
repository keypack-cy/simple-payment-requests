const { v4: uuidv4 } = require('uuid');
const moment = require('moment');
const fs = require('fs-extra');
const path = require('path');
const { jsPDF } = require('jspdf');

class PaymentRequest {
  constructor() {
    this.paymentRequests = [];
  }

  /**
   * Generate payment request data
   * @param {Object} options - Payment request generation options
   * @returns {Object} Payment request data object
   */
  generatePaymentRequestData(options) {
    const {
      client,
      project,
      items,
      requestNumber,
      issueDate = new Date(),
      dueDate,
      notes = '',
      terms = 'Net 30',
      taxRate = 0,
      discountRate = 0,
      currency = 'USD',
      paymentMethods = [],
      urgency = 'normal' // low, normal, high, urgent
    } = options;

    // Calculate totals
    const subtotal = items.reduce((sum, item) => {
      return sum + (item.quantity * item.unitPrice);
    }, 0);

    const discount = subtotal * (discountRate / 100);
    const taxableAmount = subtotal - discount;
    const tax = taxableAmount * (taxRate / 100);
    const total = taxableAmount + tax;

    const paymentRequestData = {
      id: uuidv4(),
      requestNumber: requestNumber || this.generateRequestNumber(),
      issueDate: issueDate instanceof Date ? issueDate : new Date(issueDate),
      dueDate: dueDate || this.calculateDueDate(issueDate),
      client: client,
      project: project,
      items: items,
      subtotal: subtotal,
      discount: discount,
      discountRate: discountRate,
      taxableAmount: taxableAmount,
      tax: tax,
      taxRate: taxRate,
      total: total,
      notes: notes,
      terms: terms,
      currency: currency,
      paymentMethods: paymentMethods,
      urgency: urgency,
      status: 'pending', // pending, approved, paid, overdue, cancelled
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.paymentRequests.push(paymentRequestData);
    return paymentRequestData;
  }

  /**
   * Generate a simple payment request number
   * @returns {string} Payment request number
   */
  generateRequestNumber() {
    const date = moment().format('YYYYMMDD');
    const count = this.paymentRequests.filter(req => 
      moment(req.issueDate).isSame(moment(), 'day')
    ).length + 1;
    return `PR-${date}-${count.toString().padStart(3, '0')}`;
  }

  /**
   * Calculate due date (default: 30 days from issue date)
   * @param {Date} issueDate - Issue date
   * @param {number} days - Number of days to add
   * @returns {Date} Due date
   */
  calculateDueDate(issueDate, days = 30) {
    return moment(issueDate).add(days, 'days').toDate();
  }

  /**
   * Generate PDF for payment request
   * @param {Object} paymentRequest - Payment request data
   * @param {string} outputPath - Output file path
   * @returns {Promise<string>} Path to generated PDF
   */
  async generatePDF(paymentRequest, outputPath = null) {
    try {
      const doc = new jsPDF();
      
      // Set document properties
      doc.setProperties({
        title: `Payment Request - ${paymentRequest.requestNumber}`,
        subject: `Payment Request for ${paymentRequest.project.name}`,
        author: paymentRequest.client.name,
        creator: 'Payments Request Library'
      });

      // Add header
      this.addHeader(doc, paymentRequest);
      
      // Add client and project info
      this.addClientInfo(doc, paymentRequest);
      
      // Add payment request details
      this.addRequestDetails(doc, paymentRequest);
      
      // Add items table
      this.addItemsTable(doc, paymentRequest);
      
      // Add totals
      this.addTotals(doc, paymentRequest);
      
      // Add payment methods and terms
      this.addPaymentInfo(doc, paymentRequest);
      
      // Add footer
      this.addFooter(doc, paymentRequest);

      // Save PDF
      if (!outputPath) {
        outputPath = path.join(process.cwd(), `${paymentRequest.requestNumber}.pdf`);
      }

      await fs.ensureDir(path.dirname(outputPath));
      doc.save(outputPath);
      
      return outputPath;
    } catch (error) {
      throw new Error(`Failed to generate PDF: ${error.message}`);
    }
  }

  /**
   * Add header to PDF
   * @param {jsPDF} doc - PDF document
   * @param {Object} paymentRequest - Payment request data
   */
  addHeader(doc, paymentRequest) {
    // Company logo/name (top left)
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('PAYMENT REQUEST', 20, 30);
    
    // Request number and date (top right)
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Request #: ${paymentRequest.requestNumber}`, 150, 25);
    doc.text(`Date: ${moment(paymentRequest.issueDate).format('MMM DD, YYYY')}`, 150, 35);
    doc.text(`Due Date: ${moment(paymentRequest.dueDate).format('MMM DD, YYYY')}`, 150, 45);
    
    // Urgency indicator
    if (paymentRequest.urgency !== 'normal') {
      const urgencyColors = {
        low: '#28a745',
        high: '#ffc107',
        urgent: '#dc3545'
      };
      doc.setTextColor(urgencyColors[paymentRequest.urgency]);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text(paymentRequest.urgency.toUpperCase(), 20, 50);
      doc.setTextColor(0, 0, 0); // Reset to black
    }
  }

  /**
   * Add client and project information
   * @param {jsPDF} doc - PDF document
   * @param {Object} paymentRequest - Payment request data
   */
  addClientInfo(doc, paymentRequest) {
    const y = 70;
    
    // Client information
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Bill To:', 20, y);
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(paymentRequest.client.name, 20, y + 10);
    if (paymentRequest.client.address) {
      doc.text(paymentRequest.client.address, 20, y + 20);
    }
    if (paymentRequest.client.email) {
      doc.text(paymentRequest.client.email, 20, y + 30);
    }
    if (paymentRequest.client.phone) {
      doc.text(paymentRequest.client.phone, 20, y + 40);
    }
    
    // Project information
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Project:', 120, y);
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(paymentRequest.project.name, 120, y + 10);
    if (paymentRequest.project.description) {
      doc.text(paymentRequest.project.description, 120, y + 20);
    }
    if (paymentRequest.project.startDate) {
      doc.text(`Start: ${moment(paymentRequest.project.startDate).format('MMM DD, YYYY')}`, 120, y + 30);
    }
    if (paymentRequest.project.endDate) {
      doc.text(`End: ${moment(paymentRequest.project.endDate).format('MMM DD, YYYY')}`, 120, y + 40);
    }
  }

  /**
   * Add payment request details
   * @param {jsPDF} doc - PDF document
   * @param {Object} paymentRequest - Payment request data
   */
  addRequestDetails(doc, paymentRequest) {
    const y = 130;
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Payment Request Details:', 20, y);
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    
    if (paymentRequest.notes) {
      const notes = doc.splitTextToSize(paymentRequest.notes, 170);
      doc.text(notes, 20, y + 15);
    }
  }

  /**
   * Add items table
   * @param {jsPDF} doc - PDF document
   * @param {Object} paymentRequest - Payment request data
   */
  addItemsTable(doc, paymentRequest) {
    const y = 160;
    
    // Table headers
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Item', 20, y);
    doc.text('Description', 60, y);
    doc.text('Qty', 120, y);
    doc.text('Unit Price', 140, y);
    doc.text('Amount', 170, y);
    
    // Table content
    doc.setFont('helvetica', 'normal');
    let currentY = y + 10;
    
    paymentRequest.items.forEach((item, index) => {
      if (currentY > 250) {
        doc.addPage();
        currentY = 20;
      }
      
      doc.text(item.name || `Item ${index + 1}`, 20, currentY);
      
      if (item.description) {
        const desc = doc.splitTextToSize(item.description, 50);
        doc.text(desc, 60, currentY);
      }
      
      doc.text(item.quantity.toString(), 120, currentY);
      doc.text(`${paymentRequest.currency} ${item.unitPrice.toFixed(2)}`, 140, currentY);
      doc.text(`${paymentRequest.currency} ${(item.quantity * item.unitPrice).toFixed(2)}`, 170, currentY);
      
      currentY += Math.max(10, (item.description ? doc.splitTextToSize(item.description, 50).length * 5 : 10));
    });
  }

  /**
   * Add totals section
   * @param {jsPDF} doc - PDF document
   * @param {Object} paymentRequest - Payment request data
   */
  addTotals(doc, paymentRequest) {
    const y = doc.internal.pageSize.height - 80;
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    
    doc.text('Subtotal:', 140, y);
    doc.text(`${paymentRequest.currency} ${paymentRequest.subtotal.toFixed(2)}`, 170, y);
    
    if (paymentRequest.discount > 0) {
      doc.text(`Discount (${paymentRequest.discountRate}%):`, 140, y + 10);
      doc.text(`${paymentRequest.currency} ${paymentRequest.discount.toFixed(2)}`, 170, y + 10);
    }
    
    if (paymentRequest.tax > 0) {
      doc.text(`Tax (${paymentRequest.taxRate}%):`, 140, y + 20);
      doc.text(`${paymentRequest.currency} ${paymentRequest.tax.toFixed(2)}`, 170, y + 20);
    }
    
    doc.setFont('helvetica', 'bold');
    doc.text('Total:', 140, y + 35);
    doc.text(`${paymentRequest.currency} ${paymentRequest.total.toFixed(2)}`, 170, y + 35);
  }

  /**
   * Add payment methods and terms
   * @param {jsPDF} doc - PDF document
   * @param {Object} paymentRequest - Payment request data
   */
  addPaymentInfo(doc, paymentRequest) {
    const y = doc.internal.pageSize.height - 40;
    
    // Payment methods
    if (paymentRequest.paymentMethods.length > 0) {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Payment Methods:', 20, y);
      
      doc.setFont('helvetica', 'normal');
      paymentRequest.paymentMethods.forEach((method, index) => {
        doc.text(`• ${method}`, 20, y + 10 + (index * 5));
      });
    }
    
    // Terms
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Terms:', 20, y - 20);
    
    doc.setFont('helvetica', 'normal');
    doc.text(paymentRequest.terms, 20, y - 10);
  }

  /**
   * Add footer
   * @param {jsPDF} doc - PDF document
   * @param {Object} paymentRequest - Payment request data
   */
  addFooter(doc, paymentRequest) {
    const y = doc.internal.pageSize.height - 20;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.text(`Generated on ${moment().format('MMM DD, YYYY at HH:mm')}`, 20, y);
    doc.text(`Payment Request ID: ${paymentRequest.id}`, 150, y);
  }

  /**
   * Get payment request by ID
   * @param {string} id - Payment request ID
   * @returns {Object|null} Payment request data
   */
  getPaymentRequest(id) {
    return this.paymentRequests.find(req => req.id === id) || null;
  }

  /**
   * Get all payment requests
   * @returns {Array} Array of payment requests
   */
  getAllPaymentRequests() {
    return this.paymentRequests;
  }

  /**
   * Update payment request status
   * @param {string} id - Payment request ID
   * @param {string} status - New status
   * @returns {Object|null} Updated payment request
   */
  updateStatus(id, status) {
    const request = this.getPaymentRequest(id);
    if (request) {
      request.status = status;
      request.updatedAt = new Date();
      return request;
    }
    return null;
  }

  /**
   * Delete payment request
   * @param {string} id - Payment request ID
   * @returns {boolean} Success status
   */
  deletePaymentRequest(id) {
    const index = this.paymentRequests.findIndex(req => req.id === id);
    if (index !== -1) {
      this.paymentRequests.splice(index, 1);
      return true;
    }
    return false;
  }
}

module.exports = PaymentRequest;
