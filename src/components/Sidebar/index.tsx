import React, { useState,useEffect } from "react";
import axios from "axios";
import { useDarkMode } from "usehooks-ts";
import { ReactComponent as MoonIcon } from "../../assets/icons/moon.svg";
import { ReactComponent as SunIcon } from "../../assets/icons/sun.svg";
import { Link, NavLink } from "react-router-dom";
import Logo from "../../assets/images/LogoImg.png";
import Home from "../../assets/icons/home.svg";
import Live from "../../assets/icons/live.svg";
import Pair from "../../assets/icons/liveexplorer.svg";
import { ReactComponent as TelegramIcon } from "../../assets/icons/telegram.svg";
import { ReactComponent as Twitter } from "../../assets/icons/twitter.svg";
import { ReactComponent as Website } from "../../assets/icons/website.svg";
import WallOfShame from "../../assets/icons/wallofshame.svg";
import styled from 'styled-components';

import Add from "../../assets/icons/add.svg";
import millify from "millify";

import Accordion from "../Accordion";
import "./Sidebar.scss";

interface PairData {
  pairAddress: string;

  baseToken: {
    symbol: string;
  };
  quoteToken: {
    symbol: string;
  };
  priceUsd: number;
  priceNative: number;

  volume: {
    h24: number;
  };
  priceChange: {
    h24: number;
  };
  // Add other properties based on the actual structure of your data
}

const Sidol = styled.div`

  position: relative;
  position: fixed;
  top: 0;
  left: 0;
  width: var(--width);
  bottom: 0;
  background: var(--background);
  z-index: 100;
  @media (max-width: 992px) {
    display: none;
  }

  .sidebar-container {
    width: 100%;
    height: 100%;
    overflow-y: auto;
    background: var(--background);
    transition: width 200ms linear;

    &::-webkit-scrollbar {
      width: 8px;
    }
    &::-webkit-scrollbar-thumb {
      background: var(--search-icon-bg-clr);
      border-radius: 22px;
    }

    .wrapper {
      display: flex;
      flex-direction: column;
      height: 100%;

      > nav {
        flex: 1;
      }
    }

    .logo {
      height: 60px;
      display: flex;
      align-items: center;
      padding: 12px;

      img {
        width: 42px;
      }
      span {
        font-family: var(--font-bold);
        font-size: 14px;
      }
    }
    .list {
      padding: 12px 20px;
      img {
        margin-bottom: 6px;
      }
      &:hover {
        background: var(--search-icon-bg-clr);
      }
    }

    .flex-item {
      gap: 10px;
      align-items: center;

      svg {
        color: var(--icon-clr);
      }
      span {
        font-size: 14px;
        display: var(--display);
        padding-bottom: 0;
      }
    }
    .sidebar-footer {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 10px;
      border-top: 1px solid rgba(255, 255, 255, 0.2);

  

      .stats {
        display: flex;
        align-items: center;
        justify-content: space-between;

        > span {
          padding: 4px 8px;
          background-color: var(--drop-down-clr);
          border-radius: 10px;
          color: var(--white-clr);
        }
      }

      .controls {
        display: var(--display);
      }

      button {
        width: 100%;
        border: none;
        outline: none;
        background: #ffba00;
        padding: 8px 14px;
        border-radius: 12px;
        width: 100%;
        font-size: 12px;
        color: var(--white);
        cursor: pointer;
        font-family: var(--font-semiBold);
      }

      .social-links {
        display: flex;
        align-items: center;
        gap: 10px;
        display: var(--display2);

        > a {
          svg {
            width: 16px;
            height: 16px;

            path {
              fill: var(--white-clr);
            }
          }
        }
      }

      .powered-by {
        font-size: 12px;
        color: var(--white-clr);
        display: var(--display);

        > a {
          color: var(--text-secondary-clr);
        }
      }
    }
  }
  
  .moon-sun-icon {
    cursor: pointer;
    width: 25px;
    position: absolute;
    right: var(--right); /* Adjust this value according to your preference */
    top: 20px; /* Adjust this value according to your preference */
    justify-content: center;
    align-items: center;
    height: 25px;
    border-radius: 50%;
    background: var(--search-border-clr); /* You may need to change this color */
  }

`;


const Sidebar: React.FC = () => {
  const [pairData, setPairData] = useState<PairData | null>(null);
  const { isDarkMode, toggle } = useDarkMode();


  useEffect(() => {
    if (isDarkMode) {
      if (document.body.classList.contains("light")) {
        document.body.classList.remove("light");
      }
      document.body.classList.add("dark");
    } else {
      if (document.body.classList.contains("dark")) {
        document.body.classList.remove("dark");
      }
      document.body.classList.add("light");
    }
  }, [isDarkMode]);

  useEffect(() => {
    const fetchPairData = async () => {
      try {
       
          const pairAddress = "0x8c9e29a9c6e1bcf7363cd4d0e2b75613f1b551d2";
  
          const response = await axios.get(`https://openapi.dexview.com/latest/dex/pairs/bsc/${pairAddress}`);
          setPairData(response.data.pair);
        
      } catch (error) {
        console.error("Error fetching pair data:", error);
      }
    };
  
    fetchPairData();
  }, []);
  return (
    <Sidol>
      <div className="sidebar-container">
        <div className="wrapper"
        >
         
          <Link to="/">
            <div className="logo flex-item">
              <img src={Logo} alt="" />
              <span>8BIT CHAIN</span>
              
            </div>
          </Link>
          {isDarkMode ? (
              <div className="moon-sun-icon flex-item" onClick={toggle}>
                {"<"}
              </div>
            ) : (
              <div className="moon-sun-icon flex-item" onClick={toggle}>
                               {">"}

              </div>
            )}
          <nav>
            <NavLink to="/" className="list flex-item">
              <img src={Home} alt="" width={18} height={18} />
              <span>Dashboard</span>
            </NavLink>
            <NavLink to="/dao" className="list flex-item">
              <img src={Add} alt="" width={18} height={18} />
              <span>DAO Governance</span>
            </NavLink>
            <NavLink to="/staking" className="list flex-item">
              <img src={Pair} alt="" width={18} height={18} />
              <span>Staking</span>
            </NavLink>
            <NavLink to="/nft" className="list flex-item">
              <img src={Pair} alt="" width={18} height={18} />
              <span>NFT Staking</span>
            </NavLink>
            <NavLink to="/token-distributor" className="list flex-item">
              <img src={WallOfShame} alt="" width={18} height={18} />
              <span>Redeem w8Bit</span>
            </NavLink>
        
            <Accordion />
          </nav>
          <div className="sidebar-footer">

       
          {pairData && (
            <div className="stats">
              <span>$ {millify(Number(pairData.priceUsd), { precision: 5 })}</span>
              <div></div>
            </div>
          )}
            <div className="controls">
              <button>Buy w8Bit </button>
            </div>
            <div className="social-links">
              <a href="https://8bitchain.finance" target="_blank" rel="noopener noreferrer">
                <Website />
              </a>
              <a href="https://t.me/Official_8Bitchain" target="_blank" rel="noopener noreferrer">
                <TelegramIcon />
              </a>
              <a href="https://twitter.com/8Bit_chain" target="_blank" rel="noopener noreferrer">
                <Twitter />
              </a>
            </div>
            <p className="powered-by">
              Powered By <a href="https://8bitchain.finance">8Bit Chain</a>
            </p>
          </div>
        </div>
      </div>
      
    </Sidol>
  );
};

export default Sidebar;
