/**
 * Counts the number of applied filters in a form values object
 * @param {Object} values - The form values object
 * @param {Array} activeFilters - Array of active filter keys
 * @returns {number} - Count of applied filters
 */
export const countAppliedFilters = (values, activeFilters = []) => {
  if (!values || !activeFilters.length) return 0;

  return activeFilters.reduce((count, filter) => {
    if (filter === 'Start Date' || filter === 'End Date') {
      const fromVal = values[`${filter} From`];
      const toVal = values[`${filter} To`];
      // Count date range as one filter if both dates are set
      return (fromVal && toVal) ? count + 1 : count;
    }
    // For other filters, count if value exists and is not empty
    const val = values[filter];
    return (val !== null && val !== undefined && val !== '') ? count + 1 : count;
  }, 0);
};

/**
 * Gets an array of applied filter objects with label and value
 * @param {Object} values - The form values object
 * @param {Array} activeFilters - Array of active filter keys
 * @returns {Array} - Array of { label, value } objects
 */
export const getAppliedFilters = (values, activeFilters = []) => {
  if (!values || !activeFilters.length) return [];

  return activeFilters.reduce((filters, filter) => {
    if (filter === 'Start Date' || filter === 'End Date') {
      const fromVal = values[`${filter} From`];
      const toVal = values[`${filter} To`];
      
      if (fromVal || toVal) {
        const formatDate = (date) => 
          date instanceof Date 
            ? new Intl.DateTimeFormat('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
              }).format(date)
            : '';
            
        const from = fromVal ? formatDate(fromVal) : '';
        const to = toVal ? formatDate(toVal) : '';
        const value = from || to ? `${from} - ${to}`.replace(/^\s*-\s*|\s*-\s*$/g, '') : '';
        
        if (value) {
          filters.push({ label: filter, value });
        }
      }
    } else {
      const val = values[filter];
      if (val !== null && val !== undefined && val !== '') {
        filters.push({ label: filter, value: val });
      }
    }
    return filters;
  }, []);
};
