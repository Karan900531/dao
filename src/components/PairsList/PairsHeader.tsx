import React, { useState } from "react";

import { ReactComponent as DownArrowIcon } from "../../assets/icons/down-arrow.svg";
import { ReactComponent as DrodpownDownArrowIcon } from "../../assets/icons/dropdown-down-arrow.svg";

interface IPairsHeader {
  setSelectedType: React.Dispatch<React.SetStateAction<string>>;
  selectedType: string;
  setSelectedInterval: React.Dispatch<React.SetStateAction<string>>;
  selectedInterval: string;
}

const PairsHeader: React.FC<IPairsHeader> = ({
  selectedInterval,
  setSelectedInterval,
  selectedType,
  setSelectedType,
}) => {
  const [openDropdown, setOpenDropdown] = useState(false);

  return (
    <div className="pairslist-header">
      <div className="block-left">
        <ul className="tab-container">
          {["pairs", "gainers", "losers", "updated"].map((type, index) => (
            <li key={index.toString()} className={selectedType === type ? "active" : ""}>
              <button onClick={() => setSelectedType(type)}>{type}</button>
            </li>
          ))}
        </ul>
      </div>
      {selectedType !== "updated" && (
        <div className="block-right">
          {/* <ul className="tab-container">
            {["24h", "6h", "1h", "5m", "1m"].map((interval, index) => (
              <li key={index.toString()} className={selectedInterval === interval ? "active" : ""}>
                <button onClick={() => setSelectedInterval(interval)}>{interval}</button>
              </li>
            ))}
          </ul> */}
          <div className="dropdown">
            <div className="dropdown-header" onClick={() => setOpenDropdown((d) => !d)}>
              <span>
                <DrodpownDownArrowIcon />
                Apply Filters
              </span>
              <DownArrowIcon />
            </div>
            {openDropdown && (
              <div className="dropdown-content">
                <div>
                  <span>Add Custom Filter</span>
                  <DownArrowIcon />
                </div>
                <div>
                  <span>Clear Filter</span>
                  <DownArrowIcon />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PairsHeader;
