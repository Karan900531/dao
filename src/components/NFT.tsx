import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import RangeSlider from "react-range-slider-input";
import "react-range-slider-input/dist/style.css";
import Dropdown from "./Dropdown";
import Restake from "./Restake";
import Claim from "./Claim";
import Stake from "./stake";
import Unstake from "./Unstake";
import "./nft.scss"

import rare_nft from "../Assets/rare_nft.png";
import StakingCard from "./StakingCard";
import { stakingNftCollections } from "../utils/stakingData";
import StakingCardList from "./StakingCardList";

export default function NFT() {
  const navigate = useNavigate();

  const [openDetails, setOpenDetails] = useState(false);
  const [filter1, setFilter1] = useState("Active");
  const [poolView, setPoolView] = useState("Grid");

  const sortList = ["APY", "Earned", "Amount", "Time"];

  const showList = ["Live", "Unverified", "Verified", "Cancelled", "End"];
  return (
    <>
      <div style={{marginLeft:20}}>
<h2 className="dashboard-heading" style={{marginTop:20,marginBottom:15}}>NFT Staking 
</h2>
<div>
     
<p style={{fontSize:15,marginBottom:20}}>Please choose a Pool Type for the NFT Staking


</p>

</div>
</div>

      {/* <div className="liquidity_tips mt-3 px-3">Create NFT and earn by Selling</div> */}

      {/* <div className="d-flex mt-3">
        <div
          className="currency_tabs mx-3"
          style={{ border: "1px solid", width: "fit-content" }}
        >
          <button
            className={filter1 == "Active" ? "currency_tabs_active" : undefined}
            onClick={() => {
              setFilter1("Active");
            }}
          >
            <label>Active</label>
          </button>

          <button
            className={filter1 == "Ended" ? "currency_tabs_active" : undefined}
            onClick={() => {
              setFilter1("Ended");
            }}
          >
            <label>Ended</label>
          </button>

          <button
            className={
              filter1 == "My Farms" ? "currency_tabs_active" : undefined
            }
            onClick={() => {
              setFilter1("My Farms");
            }}
          >
            <label>My NFT</label>
          </button>
        </div>
      </div> */}

      {/* <div className="d-flex justify-content-between mt-3 align-items-center filter_box">
        <div className="d-flex justify-content-between w-50 mx-4">
          <div className="filter_section">
            <p>Staked Only</p>

            <div className="mt-3">
              <input type="checkbox" />
            </div>
          </div>

          <div className="filter_section View_div">
            <p>{poolView} View</p>

            <div>
             

              <div className="d-flex">
                <button
                  className={
                    poolView === "List" ? "btn pool_view_btn active_pool_view" : "btn pool_view_btn"
                  }
                  onClick={() => {
                    setPoolView("List");
                  }}
                >
                  <i className="fa fa-list"></i>
                </button>

                <button
                  className={
                    poolView === "Grid" ? "btn pool_view_btn active_pool_view" : "btn pool_view_btn"
                  }
                  onClick={() => {
                    setPoolView("Grid");
                  }}
                >
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 28 28"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clip-path="url(#clip0_1061_37525)">
                      <path
                        d="M17.115 7.00004V12.25C17.115 12.8917 16.59 13.4167 15.9483 13.4167H12.0633C11.4217 13.4167 10.8967 12.8917 10.8967 12.25V7.00004C10.8967 6.35837 11.4217 5.83337 12.0633 5.83337H15.9483C16.59 5.83337 17.115 6.35837 17.115 7.00004ZM19.4483 13.4167H23.3333C23.975 13.4167 24.5 12.8917 24.5 12.25V7.00004C24.5 6.35837 23.975 5.83337 23.3333 5.83337H19.4483C18.8067 5.83337 18.2817 6.35837 18.2817 7.00004V12.25C18.2817 12.8917 18.795 13.4167 19.4483 13.4167ZM17.115 21V15.75C17.115 15.1084 16.59 14.5834 15.9483 14.5834H12.0633C11.4217 14.5834 10.8967 15.1084 10.8967 15.75V21C10.8967 21.6417 11.4217 22.1667 12.0633 22.1667H15.9483C16.59 22.1667 17.115 21.6417 17.115 21ZM18.2817 15.75V21C18.2817 21.6417 18.8067 22.1667 19.4483 22.1667H23.3333C23.975 22.1667 24.5 21.6417 24.5 21V15.75C24.5 15.1084 23.975 14.5834 23.3333 14.5834H19.4483C18.795 14.5834 18.2817 15.1084 18.2817 15.75ZM8.55167 14.5834H4.66667C4.025 14.5834 3.5 15.1084 3.5 15.75V21C3.5 21.6417 4.025 22.1667 4.66667 22.1667H8.55167C9.19333 22.1667 9.71833 21.6417 9.71833 21V15.75C9.71833 15.1084 9.205 14.5834 8.55167 14.5834ZM9.71833 12.25V7.00004C9.71833 6.35837 9.19333 5.83337 8.55167 5.83337H4.66667C4.025 5.83337 3.5 6.35837 3.5 7.00004V12.25C3.5 12.8917 4.025 13.4167 4.66667 13.4167H8.55167C9.205 13.4167 9.71833 12.8917 9.71833 12.25Z"
                        fill="currentColor"
                      ></path>
                    </g>
                    <defs>
                      <clipPath id="clip0_1061_37525">
                        <rect width="28" height="28" fill="white"></rect>
                      </clipPath>
                    </defs>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div className="filter_section">
            <p>Show</p>

            <Dropdown name={"Live"} list={showList} />
          </div>

          <div className="filter_section">
            <p>Sort by</p>

            <Dropdown name={"APY"} list={sortList} />
          </div>

          <div className="filter_section">
            <p>
              <br />{" "}
            </p>

            <div>
              <button className="sort_btn">
                <i className="fas fa-sort-amount-down"></i>
              </button>
            </div>
          </div>
        </div>

        <div className="filter_section w-50 mx-3">
          <p>Search</p>

          <div className="d-flex justify-content-around search_section">
            <div className="mx-3 w-75">
              <input type="text" placeholder="Seach By Pool Name...." />
            </div>

            <div className="w-25">
              <button
                className="create_btn"
                onClick={() => {
                  navigate("/StakeCreate");
                }}
              >
                <i className="fa fa-plus mx-2" aria-hidden="true"></i>
                Create Pool
              </button>
            </div>
          </div>
        </div>
      </div> */}

      <div className=" mx-4 mt-3">
        {poolView == "Grid" ? (
          <div style={{ width: "100%" }}>
            <div className=" background_box grid-wrapper" >
              {stakingNftCollections.map((m) => (
                <StakingCard key={m.nftContract} {...m} />
              ))}
            </div>
          </div>
        ) : (
          <>
            {stakingNftCollections.map((m) => (
              <StakingCardList key={m.nftContract} {...m} />
            ))}
          </>
        )}
      </div>
    </>
  );
}
