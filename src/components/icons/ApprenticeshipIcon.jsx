import React from "react";

const ApprenticeshipIcon = ({ width = 20, height = 20, color = "#D7D7E0", ...props }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <circle cx="50" cy="40" r="15" fill={color} />
    <rect x="25" y="60" width="50" height="25" rx="12" fill={color} />
    <polygon points="50,20 80,33 50,46 20,33" fill={color} />
    <circle cx="75" cy="75" r="10" fill="#222" />
    <path d="M75 68 v14 M68 75 h14" stroke="#fff" strokeWidth="2" />
  </svg>
);

export default ApprenticeshipIcon; 