import React from "react";
import "./progress-indicator.css";
const ProgressIndicator = () => {
  return (
    <div className="progress-indicator">
      <div className="circle" id="circle-1"></div>
      <div className="circle" id="circle-2"></div>
      <div className="circle" id="circle-3"></div>
      <div className="circle" id="circle-4"></div>
    </div>
  );
};

export default ProgressIndicator;
