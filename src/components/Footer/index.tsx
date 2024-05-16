import React from "react";
import { ReactComponent as TwitterIcon } from "../../assets/icons/twitterIcon.svg";
import { ReactComponent as TelegramIcon } from "../../assets/icons/telegramIcon.svg";
import { ReactComponent as InstagramIcon } from "../../assets/icons/instagram.svg";
import { ReactComponent as YouTubeIcon } from "../../assets/icons/youtube.svg";

// import { ReactComponent as AppStoreIcon } from "../../assets/icons/appstore.svg";
// import { ReactComponent as TikTok } from "../../assets/icons/tiktok.svg";
// import { ReactComponent as GooglePayIcon } from "../../assets/icons/googleplay.svg";
import { ReactComponent as DiscordIcon } from "../../assets/icons/discord.svg";
import { ReactComponent as MediumIcon } from "../../assets/icons/mediumIcon.svg";

import "./Footer.scss";
import { Link } from "react-router-dom";

const renderLinks = (
  <div className="links flex-item">
    {/* <Link to="/">General Statement</Link> */}
    {/* <Link to="/">Legal Advice</Link> */}
    <Link to="/">About us</Link>
    <Link to="/">Team</Link>
    <Link to="https://www.8bitchain.io/">w8Bit</Link>
    <Link to="https://wp.8bitchain.io/8bit-chain-whitepaper/">Docs</Link>

    {/* <Link to="/">Contact</Link> */}
  </div>
);
const Footer: React.FC = () => {
  return (
    <div className="footer-wrapper pad">
      <div className="mx">
        <div className="footer-container">
          
          <div className="footer-content flex-item">
            <div className="media flex-item">
              <a href="https://twitter.com/8Bit_Chain">
                <TwitterIcon />
              </a>
              <a href="https://t.me/official_8Bitchain">
                <TelegramIcon />
              </a>
              <a href="/">
                <DiscordIcon />
              </a>
              <a href="https://medium.8bitchain/">
                <MediumIcon />
              </a>
              <a href="https://instagram.8bitchain/">
                <InstagramIcon />
              </a>

              <a href="/">
                <YouTubeIcon />
              </a>
            </div>

            <div className="footer-second-content flex-item">
              {/* <div className="app-icon flex-item">
                <AppStoreIcon />
                <GooglePayIcon />
              </div> */}
              <div className="list-navigation">

                <div>
                  <p className="para">
                    ©                      <span style={{ color: '#ffba00' }} >
8BitChain.io </span> 2023
                    {/* <span>
                      <a href="/">2.57.0 - info@8bitchain.io</a>
                    </span> */}
                   
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
