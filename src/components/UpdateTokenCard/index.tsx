import React from "react";

import "./UpdateTokenCard.scss";

import { ReactComponent as TwitterIcon } from "../../assets/icons/twitter.svg";

interface IUpdateTokenCard {
  logo: string;
  name: string;
  symbol: string;
}

const UpdateTokenCard: React.FC<IUpdateTokenCard> = ({ name, symbol, logo }) => {
  return (
    <div className="update-token-card">
      <div className="block-left">
        <img src={logo} alt="" />
        <div className="flex-column">
          <h3>{name}</h3>
          <p>{symbol}</p>
        </div>
      </div>
      <div className="block-right">
        <div className="flex">
          <a href="/" target="_blank" rel="noopener noreferrer">
            <TwitterIcon />
          </a>
          <a href="/" target="_blank" rel="noopener noreferrer">
            <TwitterIcon />
          </a>
          <a href="/" target="_blank" rel="noopener noreferrer">
            <TwitterIcon />
          </a>
        </div>
        <p>53 hour ago</p>
      </div>
    </div>
  );
};

export default UpdateTokenCard;
