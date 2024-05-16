import React, { useState } from "react";

import Live from "../assets/icons/live.svg";
import Prodex from "../assets/images/prodex.png";
import Proassure from "../assets/images/proassure.png";
import Progallery from "../assets/images/progallery.png";
import protracker from "../assets/images/sidebarLogo.png";
import Probridge from "../assets/images/probridge.png";
import Propad from "../assets/images/propad.png";
import Propos from "../assets/images/propos.png";

const Accordion: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="accordion">
      <div
        style={{ cursor: "pointer" }}
        className="list flex-item"
        role="button"
        onClick={() => setOpen((o) => !o)}
      >
        <img src={Live} alt="" width={18} height={18} />
        <span style={{ marginLeft: "5px" }}>8Bit Ecosystem</span>
      </div>
      {open && (
        <div className="accordion-list" style={{ marginLeft: "-7px" }}>
          <a href="https://prodex.finance/" className="list flex-item">
            <img src={Prodex} alt="prodex" width="30" height="30"></img>
            <span style={{ marginLeft: "10px" }}>ProDex </span>
          </a>
          <a href="https://proassure.finance" className="list flex-item">
            <img src={Proassure} alt="prodex" width="30" height="30"></img>

            <span style={{ marginLeft: "10px" }}>ProAssure</span>
          </a>

          <a href="https://protrackers.finance" className="list flex-item">
            <img src={protracker} alt="prodex" width="30" height="30"></img>

            <span style={{ marginLeft: "10px" }}>ProTrackers</span>
          </a>
       
          <a href="https://progallery.finance" className="list flex-item">
            <img src={Progallery} alt="prodex" width="30" height="30"></img>

            <span style={{ marginLeft: "10px" }}>ProGallery</span>
          </a>
          <a href="https://probridge.finance" className="list flex-item">
            <img src={Probridge} alt="prodex" width="30" height="30"></img>

            <span style={{ marginLeft: "10px" }}>ProBridge</span>
          </a>
          <a href="https://propad.finance/" className="list flex-item">
            <img src={Propad} alt="prodex" width="30" height="30"></img>

            <span style={{ marginLeft: "10px" }}>ProPad</span>
          </a>
          <a
            href="https://8bitscan.com"
            className="list flex-item"
          >
            <img src={Propos} alt="prodex" width="30" height="30"></img>

            <span style={{ marginLeft: "10px" }}>8Bit Scan</span>
          </a>
          {/* <a href="/" className="list flex-item">
            <img src={Probridge} alt="prodex" width="30" height="30"></img>

            <span style={{ marginLeft: "10px" }}>ProTracker</span>
          </a> */}
         
        </div>
      )}
    </div>
  );
};

export default Accordion;
