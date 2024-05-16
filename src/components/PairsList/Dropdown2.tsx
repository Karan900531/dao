import React, { useState } from 'react';
import styled from 'styled-components';

// Define prop types
interface CustomDropdownProps {
  options: string[];
  value: string;
  onChange: (option: string) => void;
}

// Styled components for the custom dropdown
const CustomDropdownContainer = styled.div`
  position: relative;
  margin-left:30px;
`;

const CustomSelectButton = styled.button`
  padding: 8px 15px;
  border: 1px solid #000;
  border-radius: 7px;
  background-color: #23323c;
  color: #ffba00;
  cursor: pointer;
  width: 150px;
  text-align: left;
  display: flex;
  justify-content: space-between;

  @media (max-width: 768px) {

    width: 90px;

  }
`;

const CustomOptions = styled.ul<{ open: boolean }>`
  position: absolute;
  top: 100%;
  left: 0;
  width: 150px;
  color:#ffba00;
  font-size:12px;
  background-color: #23323c;
  border: 1px solid #000;
  border-top: none;
  border-radius: 0 0 7px 7px;
  padding: 0;
  margin: 0;
  list-style: none;
  display: ${({ open }) => (open ? 'block' : 'none')};

  @media (max-width: 768px) {

    width: 90px;

  }
  
`;

const CustomOption = styled.li`
  padding: 8px 15px;
  cursor: pointer;
  &:hover {
    background-color: #000;
  }
`;

// Custom dropdown component
const CustomDropdown: React.FC<CustomDropdownProps> = ({ options, value, onChange }) => {
  const [open, setOpen] = useState(false);

  const handleOptionClick = (option: string) => {
    onChange(option);
    setOpen(false);
  };

  return (
    <CustomDropdownContainer>
      <CustomSelectButton onClick={() => setOpen(!open)}>
        {value}
        <span>&#9662;</span> {/* Downward arrow */}
      </CustomSelectButton>
      <CustomOptions open={open}>
        {options.map((option) => (
          <CustomOption key={option} onClick={() => handleOptionClick(option)}>
            {option}
          </CustomOption>
        ))}
      </CustomOptions>
    </CustomDropdownContainer>
  );
};

export default CustomDropdown;
