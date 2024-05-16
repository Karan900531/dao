// ProgressBar.tsx

import React from "react";

interface ProgressBarProps {
  percentage: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ percentage }) => {
  return (
    <div className="progress-baring">
      <div
        className="progress-filling"
        style={{
          width: `${percentage}%`,
        }}
      />
    </div>
  );
};

export default ProgressBar;
