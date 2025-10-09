import React from 'react';
import PropTypes from 'prop-types';

const InputErr = ({ children }) => {
  // If children is an object, try to stringify it or show a fallback message
  const renderError = () => {
    if (!children) return null;
    
    if (typeof children === 'string') {
      return children;
    }
    
    if (typeof children === 'object') {
      // If it's an Error object, return its message
      if (children.message) {
        return children.message;
      }
      // Otherwise try to stringify it safely
      try {
        return JSON.stringify(children);
      } catch (e) {
        return 'An error occurred';
      }
    }
    
    return String(children);
  };

  const errorMessage = renderError();
  
  if (!errorMessage) return null;
  
  return <p className="error--text">{errorMessage}</p>;
};

InputErr.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.node
  ])
};

export default InputErr;
