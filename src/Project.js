const { v4: uuidv4 } = require('uuid');
const moment = require('moment');

class Project {
  constructor(options = {}) {
    const {
      name,
      description,
      startDate,
      endDate,
      budget,
      currency = 'USD',
      status = 'active', // active, completed, on-hold, cancelled
      clientId,
      manager,
      category,
      tags = [],
      notes = ''
    } = options;

    this.id = uuidv4();
    this.name = name || '';
    this.description = description || '';
    this.startDate = startDate ? new Date(startDate) : null;
    this.endDate = endDate ? new Date(endDate) : null;
    this.budget = budget || 0;
    this.currency = currency;
    this.status = status;
    this.clientId = clientId || '';
    this.manager = manager || '';
    this.category = category || '';
    this.tags = Array.isArray(tags) ? tags : [];
    this.notes = notes || '';
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  /**
   * Update project information
   * @param {Object} updates - Fields to update
   * @returns {Project} Updated project instance
   */
  update(updates) {
    Object.keys(updates).forEach(key => {
      if (this.hasOwnProperty(key) && key !== 'id' && key !== 'createdAt') {
        if (key === 'startDate' || key === 'endDate') {
          this[key] = updates[key] ? new Date(updates[key]) : null;
        } else if (key === 'tags' && Array.isArray(updates[key])) {
          this[key] = updates[key];
        } else if (key !== 'tags') {
          this[key] = updates[key];
        }
      }
    });
    
    this.updatedAt = new Date();
    return this;
  }

  /**
   * Get project duration in days
   * @returns {number} Duration in days
   */
  getDuration() {
    if (!this.startDate || !this.endDate) return 0;
    
    const start = moment(this.startDate);
    const end = moment(this.endDate);
    return end.diff(start, 'days');
  }

  /**
   * Get project duration in a human-readable format
   * @returns {string} Formatted duration
   */
  getFormattedDuration() {
    const duration = this.getDuration();
    if (duration === 0) return 'N/A';
    
    if (duration < 30) {
      return `${duration} days`;
    } else if (duration < 365) {
      const months = Math.floor(duration / 30);
      const days = duration % 30;
      return `${months} month${months > 1 ? 's' : ''}${days > 0 ? `, ${days} days` : ''}`;
    } else {
      const years = Math.floor(duration / 365);
      const months = Math.floor((duration % 365) / 30);
      return `${years} year${years > 1 ? 's' : ''}${months > 0 ? `, ${months} months` : ''}`;
    }
  }

  /**
   * Check if project is overdue
   * @returns {boolean} Overdue status
   */
  isOverdue() {
    if (!this.endDate || this.status === 'completed' || this.status === 'cancelled') {
      return false;
    }
    
    return moment().isAfter(this.endDate);
  }

  /**
   * Get days until deadline
   * @returns {number} Days until deadline (negative if overdue)
   */
  getDaysUntilDeadline() {
    if (!this.endDate) return null;
    
    return moment(this.endDate).diff(moment(), 'days');
  }

  /**
   * Get project progress percentage
   * @param {Date} currentDate - Current date for progress calculation
   * @returns {number} Progress percentage (0-100)
   */
  getProgress(currentDate = new Date()) {
    if (!this.startDate || !this.endDate) return 0;
    
    const start = moment(this.startDate);
    const end = moment(this.endDate);
    const current = moment(currentDate);
    
    if (current.isBefore(start)) return 0;
    if (current.isAfter(end)) return 100;
    
    const totalDuration = end.diff(start, 'milliseconds');
    const elapsed = current.diff(start, 'milliseconds');
    
    return Math.round((elapsed / totalDuration) * 100);
  }

  /**
   * Add tag to project
   * @param {string} tag - Tag to add
   * @returns {Project} Updated project instance
   */
  addTag(tag) {
    if (tag && !this.tags.includes(tag)) {
      this.tags.push(tag);
      this.updatedAt = new Date();
    }
    return this;
  }

  /**
   * Remove tag from project
   * @param {string} tag - Tag to remove
   * @returns {Project} Updated project instance
   */
  removeTag(tag) {
    const index = this.tags.indexOf(tag);
    if (index > -1) {
      this.tags.splice(index, 1);
      this.updatedAt = new Date();
    }
    return this;
  }

  /**
   * Check if project has specific tag
   * @param {string} tag - Tag to check
   * @returns {boolean} Tag presence
   */
  hasTag(tag) {
    return this.tags.includes(tag);
  }

  /**
   * Get budget in formatted currency
   * @returns {string} Formatted budget
   */
  getFormattedBudget() {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: this.currency
    }).format(this.budget);
  }

  /**
   * Validate project data
   * @returns {Object} Validation result with isValid and errors
   */
  validate() {
    const errors = [];
    
    if (!this.name || this.name.trim().length === 0) {
      errors.push('Project name is required');
    }
    
    if (this.startDate && this.endDate && this.startDate > this.endDate) {
      errors.push('Start date cannot be after end date');
    }
    
    if (this.budget < 0) {
      errors.push('Budget cannot be negative');
    }
    
    if (!['active', 'completed', 'on-hold', 'cancelled'].includes(this.status)) {
      errors.push('Invalid project status');
    }
    
    return {
      isValid: errors.length === 0,
      errors: errors
    };
  }

  /**
   * Mark project as completed
   * @returns {Project} Updated project instance
   */
  markCompleted() {
    this.status = 'completed';
    this.updatedAt = new Date();
    return this;
  }

  /**
   * Mark project as on-hold
   * @returns {Project} Updated project instance
   */
  markOnHold() {
    this.status = 'on-hold';
    this.updatedAt = new Date();
    return this;
  }

  /**
   * Cancel project
   * @returns {Project} Updated project instance
   */
  cancel() {
    this.status = 'cancelled';
    this.updatedAt = new Date();
    return this;
  }

  /**
   * Get project summary
   * @returns {Object} Project summary information
   */
  getSummary() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      status: this.status,
      startDate: this.startDate,
      endDate: this.endDate,
      budget: this.budget,
      currency: this.currency,
      clientId: this.clientId,
      manager: this.manager,
      category: this.category,
      tags: this.tags,
      duration: this.getFormattedDuration(),
      progress: this.getProgress(),
      isOverdue: this.isOverdue()
    };
  }

  /**
   * Convert project to JSON
   * @returns {Object} JSON representation
   */
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      startDate: this.startDate,
      endDate: this.endDate,
      budget: this.budget,
      currency: this.currency,
      status: this.status,
      clientId: this.clientId,
      manager: this.manager,
      category: this.category,
      tags: this.tags,
      notes: this.notes,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  /**
   * Create project from JSON data
   * @param {Object} data - JSON data
   * @returns {Project} New project instance
   */
  static fromJSON(data) {
    const project = new Project();
    Object.assign(project, data);
    return project;
  }
}

module.exports = Project;
