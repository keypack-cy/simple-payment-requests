const { v4: uuidv4 } = require('uuid');

class Client {
  constructor(options = {}) {
    const {
      name,
      email,
      phone,
      address,
      company,
      taxId,
      paymentTerms = 'Net 30',
      currency = 'USD',
      notes = ''
    } = options;

    this.id = uuidv4();
    this.name = name || '';
    this.email = email || '';
    this.phone = phone || '';
    this.address = address || '';
    this.company = company || '';
    this.taxId = taxId || '';
    this.paymentTerms = paymentTerms;
    this.currency = currency;
    this.notes = notes;
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.active = true;
  }

  /**
   * Update client information
   * @param {Object} updates - Fields to update
   * @returns {Client} Updated client instance
   */
  update(updates) {
    Object.keys(updates).forEach(key => {
      if (this.hasOwnProperty(key) && key !== 'id' && key !== 'createdAt') {
        this[key] = updates[key];
      }
    });
    
    this.updatedAt = new Date();
    return this;
  }

  /**
   * Get client's full address as a formatted string
   * @returns {string} Formatted address
   */
  getFullAddress() {
    if (!this.address) return '';
    
    if (typeof this.address === 'string') {
      return this.address;
    }
    
    // Handle address object
    const parts = [];
    if (this.address.street) parts.push(this.address.street);
    if (this.address.city) parts.push(this.address.city);
    if (this.address.state) parts.push(this.address.state);
    if (this.address.zipCode) parts.push(this.address.zipCode);
    if (this.address.country) parts.push(this.address.country);
    
    return parts.join(', ');
  }

  /**
   * Get client's contact information as a formatted string
   * @returns {string} Formatted contact info
   */
  getContactInfo() {
    const parts = [];
    if (this.email) parts.push(`Email: ${this.email}`);
    if (this.phone) parts.push(`Phone: ${this.phone}`);
    
    return parts.join(' | ');
  }

  /**
   * Validate client data
   * @returns {Object} Validation result with isValid and errors
   */
  validate() {
    const errors = [];
    
    if (!this.name || this.name.trim().length === 0) {
      errors.push('Client name is required');
    }
    
    if (this.email && !this.isValidEmail(this.email)) {
      errors.push('Invalid email format');
    }
    
    if (this.phone && !this.isValidPhone(this.phone)) {
      errors.push('Invalid phone number format');
    }
    
    return {
      isValid: errors.length === 0,
      errors: errors
    };
  }

  /**
   * Check if email is valid
   * @param {string} email - Email to validate
   * @returns {boolean} Validation result
   */
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Check if phone number is valid
   * @param {string} phone - Phone number to validate
   * @returns {boolean} Validation result
   */
  isValidPhone(phone) {
    // Basic phone validation - can be customized
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
  }

  /**
   * Deactivate client
   * @returns {Client} Updated client instance
   */
  deactivate() {
    this.active = false;
    this.updatedAt = new Date();
    return this;
  }

  /**
   * Activate client
   * @returns {Client} Updated client instance
   */
  activate() {
    this.active = true;
    this.updatedAt = new Date();
    return this;
  }

  /**
   * Get client summary
   * @returns {Object} Client summary information
   */
  getSummary() {
    return {
      id: this.id,
      name: this.name,
      company: this.company,
      email: this.email,
      phone: this.phone,
      currency: this.currency,
      paymentTerms: this.paymentTerms,
      active: this.active,
      createdAt: this.createdAt
    };
  }

  /**
   * Convert client to JSON
   * @returns {Object} JSON representation
   */
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      phone: this.phone,
      address: this.address,
      company: this.company,
      taxId: this.taxId,
      paymentTerms: this.paymentTerms,
      currency: this.currency,
      notes: this.notes,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      active: this.active
    };
  }

  /**
   * Create client from JSON data
   * @param {Object} data - JSON data
   * @returns {Client} New client instance
   */
  static fromJSON(data) {
    const client = new Client();
    Object.assign(client, data);
    return client;
  }
}

module.exports = Client;
