import React from "react";
import { ReactComponent as IIcon } from "../../assets/icons/i.svg";
import { ReactComponent as RightArrow } from "../../assets/icons/chevron-right.svg";
import { ReactComponent as RecentlyUpateIcon } from "../../assets/icons/recentlyUpdateIcon.svg";
import { ReactComponent as LaptopIcon } from "../../assets/icons/laptopIcon.svg";
import { ReactComponent as TwitterIcon } from "../../assets/icons/twitterIcon.svg";
import { ReactComponent as NetIcon } from "../../assets/icons/net.svg";
import { ReactComponent as TelegramIcon } from "../../assets/icons/telegramIcon.svg";
import "./RecentlyUpdate.scss";
import { ILiveData } from "../../constants/types";

const RecentlyUpdate: React.FC<{ liveData: ILiveData[] }> = ({ liveData }) => {
  return (
    <div className="recently-update-wrapper">
      <div className="border-animation-wrapper">
        <div className="border-animation"></div>
      </div>
      <div className="live-data-card-container">
        <div className="live-data-card flex-item">
          <div className="daily-gainers-heading flex-item">
            <div className="chat-icon">
              <RecentlyUpateIcon />
            </div>
            <p>Recently Reviewed </p>
            <div className="iicon">
              <IIcon />
            </div>
          </div>
          <div className="more-content flex-item">
            <p>More</p>
            <RightArrow />
          </div>
        </div>

        <div className="update-content">
          {liveData.map((f, index) => {
            return (
              <div key={index} className="data-content flex-item">
                <div className="data-items flex-item">
                  <img src={f.logo} alt="" />
                  <p>{f.tokenName}</p>
                </div>
                <div className="icons flex-item">
                  <LaptopIcon />
                  <TwitterIcon />
                  <TelegramIcon />
                  <div className="icon">
                    <NetIcon />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RecentlyUpdate;
