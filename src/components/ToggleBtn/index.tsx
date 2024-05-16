import React from "react";
import "./ToggleBtn.css";

interface IToggle {
  isOn: boolean;
  handleToggle: () => void;
  colorOne: string;
  colorTwo: string;
}

const ToggleBtn: React.FC<IToggle> = ({
  isOn,
  handleToggle,
  colorOne,
  colorTwo,
}) => {
  return (
    <div className="toggle-wrapper">
      <input
        checked={isOn}
        onChange={handleToggle}
        className="switch-checkbox"
        id={`switch`}
        type="checkbox"
      />
      <label
        style={{ background: isOn ? colorOne : colorTwo }}
        className="switch-label"
        htmlFor={`switch`}
      >
        <span className={`switch-button`} />
      </label>
    </div>
  );
};

export default ToggleBtn;
