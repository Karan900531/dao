// react-progress-bar-plus.d.ts
declare module 'react-progress-bar-plus' {
    const ProgressBar: React.FC<ProgressBarProps>;
    export default ProgressBar;
  
    interface ProgressBarProps {
      percent?: number;
      autoIncrement?: boolean;
      // ... add other props if needed
    }
  }
  