// Popup.tsx
import React from 'react';
import styled from 'styled-components';
import Quote from "../RequestQuote";

interface PopupProps {
  onClose: () => void;
}

const Backdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent black */
  z-index: 999; /* Ensure backdrop is behind the popup */
`;

const PopupContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  @media (max-width: 768px) {
    min-width:100%;
  }
`;

const QuoteRequestPopup: React.FC<PopupProps> = ({ onClose }) => {
  return (
    <>
      <Backdrop onClick={onClose} />
      <PopupContainer>
        <Quote onCloses={onClose} />
        {/* Add form elements for requesting a quote */}
      </PopupContainer>
    </>
  );
};

export default QuoteRequestPopup;
