import React from "react";

const FreelanceIcon = ({ width = 20, height = 20, color = "#D7D7E0", ...props }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <rect x="20" y="55" width="60" height="20" rx="3" stroke={color} strokeWidth="4" fill="none"/>
    <circle cx="65" cy="65" r="2.5" fill={color}/>
    <circle cx="60" cy="40" r="12" stroke={color} strokeWidth="4" fill="none"/>
    <path d="M60 52 Q50 55 40 52 Q30 49 30 65" stroke={color} strokeWidth="4" fill="none"/>
  </svg>
);

export default FreelanceIcon; 