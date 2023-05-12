import React from "react";
import PropTypes from "prop-types";

const InputErr = ({children}) => {
    return <p className="error--text">{children}</p>;
};

InputErr.propTypes = {
  children: PropTypes.node.isRequired,
};

export default InputErr;
