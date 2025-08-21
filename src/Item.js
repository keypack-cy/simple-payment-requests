const { v4: uuidv4 } = require('uuid');

class Item {
  constructor(options = {}) {
    const {
      name,
      description,
      quantity = 1,
      unitPrice = 0,
      unit = 'piece', // piece, hour, day, month, etc.
      category,
      sku,
      taxRate = 0,
      discountRate = 0
    } = options;

    this.id = uuidv4();
    this.name = name || '';
    this.description = description || '';
    this.quantity = quantity;
    this.unitPrice = unitPrice;
    this.unit = unit;
    this.category = category || '';
    this.sku = sku || '';
    this.taxRate = taxRate;
    this.discountRate = discountRate;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  /**
   * Update item information
   * @param {Object} updates - Fields to update
   * @returns {Item} Updated item instance
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
   * Get subtotal for this item (quantity * unit price)
   * @returns {number} Subtotal amount
   */
  getSubtotal() {
    return this.quantity * this.unitPrice;
  }

  /**
   * Get discount amount for this item
   * @returns {number} Discount amount
   */
  getDiscount() {
    return this.getSubtotal() * (this.discountRate / 100);
  }

  /**
   * Get taxable amount (subtotal - discount)
   * @returns {number} Taxable amount
   */
  getTaxableAmount() {
    return this.getSubtotal() - this.getDiscount();
  }

  /**
   * Get tax amount for this item
   * @returns {number} Tax amount
   */
  getTax() {
    return this.getTaxableAmount() * (this.taxRate / 100);
  }

  /**
   * Get total amount for this item (subtotal - discount + tax)
   * @returns {number} Total amount
   */
  getTotal() {
    return this.getSubtotal() - this.getDiscount() + this.getTax();
  }

  /**
   * Get formatted unit price
   * @param {string} currency - Currency code
   * @returns {string} Formatted unit price
   */
  getFormattedUnitPrice(currency = 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(this.unitPrice);
  }

  /**
   * Get formatted subtotal
   * @param {string} currency - Currency code
   * @returns {string} Formatted subtotal
   */
  getFormattedSubtotal(currency = 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(this.getSubtotal());
  }

  /**
   * Get formatted total
   * @param {string} currency - Currency code
   * @returns {string} Formatted total
   */
  getFormattedTotal(currency = 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(this.getTotal());
  }

  /**
   * Get quantity with unit
   * @returns {string} Formatted quantity with unit
   */
  getQuantityWithUnit() {
    if (this.quantity === 1) {
      return `1 ${this.unit}`;
    }
    return `${this.quantity} ${this.unit}s`;
  }

  /**
   * Check if item has discount
   * @returns {boolean} Has discount
   */
  hasDiscount() {
    return this.discountRate > 0;
  }

  /**
   * Check if item is taxable
   * @returns {boolean} Is taxable
   */
  isTaxable() {
    return this.taxRate > 0;
  }

  /**
   * Calculate item cost per unit including tax and discount
   * @returns {number} Cost per unit
   */
  getCostPerUnit() {
    const subtotal = this.getSubtotal();
    const discount = this.getDiscount();
    const tax = this.getTax();
    
    return (subtotal - discount + tax) / this.quantity;
  }

  /**
   * Validate item data
   * @returns {Object} Validation result with isValid and errors
   */
  validate() {
    const errors = [];
    
    if (!this.name || this.name.trim().length === 0) {
      errors.push('Item name is required');
    }
    
    if (this.quantity <= 0) {
      errors.push('Quantity must be greater than 0');
    }
    
    if (this.unitPrice < 0) {
      errors.push('Unit price cannot be negative');
    }
    
    if (this.taxRate < 0 || this.taxRate > 100) {
      errors.push('Tax rate must be between 0 and 100');
    }
    
    if (this.discountRate < 0 || this.discountRate > 100) {
      errors.push('Discount rate must be between 0 and 100');
    }
    
    return {
      isValid: errors.length === 0,
      errors: errors
    };
  }

  /**
   * Clone item
   * @returns {Item} New item instance with same data
   */
  clone() {
    return new Item({
      name: this.name,
      description: this.description,
      quantity: this.quantity,
      unitPrice: this.unitPrice,
      unit: this.unit,
      category: this.category,
      sku: this.sku,
      taxRate: this.taxRate,
      discountRate: this.discountRate
    });
  }

  /**
   * Get item summary
   * @returns {Object} Item summary information
   */
  getSummary() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      quantity: this.quantity,
      unitPrice: this.unitPrice,
      unit: this.unit,
      category: this.category,
      sku: this.sku,
      subtotal: this.getSubtotal(),
      discount: this.getDiscount(),
      tax: this.getTax(),
      total: this.getTotal(),
      hasDiscount: this.hasDiscount(),
      isTaxable: this.isTaxable()
    };
  }

  /**
   * Convert item to JSON
   * @returns {Object} JSON representation
   */
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      quantity: this.quantity,
      unitPrice: this.unitPrice,
      unit: this.unit,
      category: this.category,
      sku: this.sku,
      taxRate: this.taxRate,
      discountRate: this.discountRate,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  /**
   * Create item from JSON data
   * @param {Object} data - JSON data
   * @returns {Item} New item instance
   */
  static fromJSON(data) {
    const item = new Item();
    Object.assign(item, data);
    return item;
  }

  /**
   * Create a service item (time-based)
   * @param {Object} options - Service item options
   * @returns {Item} New service item
   */
  static createService(options) {
    return new Item({
      ...options,
      unit: options.unit || 'hour',
      category: options.category || 'Services'
    });
  }

  /**
   * Create a product item
   * @param {Object} options - Product item options
   * @returns {Item} New product item
   */
  static createProduct(options) {
    return new Item({
      ...options,
      unit: options.unit || 'piece',
      category: options.category || 'Products'
    });
  }
}

module.exports = Item;
