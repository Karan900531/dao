import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Modal } from "react-bootstrap";
import Dropdown from "./Dropdown";
import styled from "styled-components";
import { ethers, formatEther, MaxUint256, parseEther } from "ethers";

import tether from "../Assets/tether.png";
import { useWeb3Modal } from "@web3modal/react";
// import PairsList from "../../components/PairsList";
// import Dropdown from "../../components/Dropdown";
import {
  claimRewards,
  getApy,
  getStakedAmount,
  getTokenHolders,
  getTokenStaked,
  getEarnedReward,
  getUserReward,
  stakeToken,
  getTimeRemainingForUnstake,
  getTimeRemainingForReward,

  unStakeToken,
  getUserTradeHistory,
  getWithdrawableBalance,
} from "../utils/method3";
import { useAccount, useChainId } from "wagmi";
import { getUserBalance } from "../utils/tokenContract";
import eth from "../assets/eth.png";
import bnb from "../Assets/bnb.png";
import Eightbitchain from "../assets/8bitchain.png";

export default function Farm() {
  const [pooltabs, setPoolTabs] = useState("All");
  const [poolView, setPoolView] = useState("Grid");
  const [chainModal, setChainModal] = useState(false);
  const [filter1, setFilter1] = useState("Active");
  const [filter2, setFilter2] = useState("All");
  const [View, setView] = useState("");
  const [ROIModal, setROIModal] = useState(false);

  const navigate = useNavigate();
  useEffect(() => {
    console.log(View);
  }, [View]);
  const listdeposit = ["AVG ARP", "AVG ARP", "Staked TVL", "Staked TVL"];



  const { open } = useWeb3Modal();
  const { address } = useAccount();
  const chain = useChainId();
  const [status, setStatus] = useState<{
    status: "PROCESSING" | "ERROR" | "SUCCESS";
    message: string;
  } | null>(null);
  const [amount, setAmount] = useState("");
  const [amountU, setAmountU] = useState("");

  const [stakedAmount, setStakedAmount] = useState(0);
  const [rewardAmount, setRewardAmount] = useState(0.0000);
  const [withdrawlbal, setWithdraw] = useState(0);
  const [minunstake, setMinunstake] = useState(0);
  const [minreward, setMinreward] = useState(0);

  const [balance, setBalance] = useState(0);
  const [totalStaked, setTotalStaked] = useState(0);
  const [apy, setApy] = useState(0);
  const [totalTokenHolders, setTotalTokenHolders] = useState(0);
  const [rewardLeft, setRewardLeft] = useState(0);
  const [earned, setEarned] = useState(0);


  const [isBelowMinStake, setIsBelowMinStake] = useState(false);
  const [tradeHistory, setTradeHistory] = useState<{ actionType: any; amount: any; timestamp: any }[]>([]);

  // Function to fetch user trade history
  const fetchUserTradeHistory = useCallback(async () => {
    try {
      if (!address || !chain) return;
      const history = await getUserTradeHistory(address, chain);
      console.log("History fetched:", history); // Add this line for debugging
      setTradeHistory(history);
    } catch (error) {
      console.log(error);
    }
  }, [address, chain]);
  useEffect(() => {
    fetchUserTradeHistory();
  }, [fetchUserTradeHistory]);

  // Function to calculate time remaining and update state
  const [initialTime] = useState(Date.now());
  const [timeRemaining, setTimeRemaining] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (minunstake > 0) {
        setMinunstake(prevTime => prevTime - 1);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [minunstake]);

  // Convert time remaining to hours, minutes, seconds format
  const formatTime = (timeInSeconds:any) => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;
  
    // Function to pad single digit numbers with leading zero
    const padZero = (num:any) => {
      return num < 10 ? "0" + num : num;
    };
  
    return {
      hours: padZero(hours),
      minutes: padZero(minutes),
      seconds: padZero(seconds)
    };
  };

  

const { hours, minutes, seconds } = formatTime(minunstake);


useEffect(() => {
  const timers = setTimeout(() => {
    if (minreward > 0) {
      setMinreward(prevTimes => prevTimes - 1);
    }
  }, 1000);

  return () => clearTimeout(timers);
}, [minreward]);

// Convert time remaining to hours, minutes, seconds format
const formatTimes = (timeInSecondss:any) => {
  const hourss = Math.floor(timeInSecondss / 3600);
  const minutess = Math.floor((timeInSecondss % 3600) / 60);
  const secondss = timeInSecondss % 60;

  // Function to pad single digit numbers with leading zero
  const padZeros = (nums:any) => {
    return nums < 10 ? "0" + nums : nums;
  };

  return {
    hourss: padZeros(hourss),
    minutess: padZeros(minutess),
    secondss: padZeros(secondss)
  };
};



const { hourss, minutess, secondss } = formatTimes(minreward);


  const handleGetData = useCallback(async () => {
    try {
      if (!address || !chain) return;
      setBalance(await getUserBalance(address, chain));
      setStakedAmount(await getStakedAmount(address, chain));
      setEarned(await getEarnedReward(address, chain));

      setRewardAmount(await getUserReward(address, chain));
      setWithdraw(await getWithdrawableBalance(address, chain));
      setMinunstake(await getTimeRemainingForUnstake(address, chain));
      const minReward = await getTimeRemainingForReward(address, chain);
      setMinreward(Number(minReward));

    } catch (error) {
      console.log(error);
    }
  }, [address, chain]);

  const handleGetContractData = useCallback(async () => {
    try {
      setTotalTokenHolders(await getTokenHolders(chain));
      setTotalStaked(await getTokenStaked(chain));
      setApy(await getApy(chain));
    } catch (error) {
      console.log(error);
    }
  }, [chain]);

  useEffect(() => {
    handleGetData();
    handleGetContractData();
  }, [handleGetData, handleGetContractData]);

  const MainDiv = styled.div`
    width: 80%;
    height: auto;

    padding-top: 0px;
    display: flex;
    padding-bottom: 30px;
    justify-content: center;
    align-items: center;
  `;

  const div = styled.div`
  
  `;

  const InnerDiv = styled.div`
    background-size: cover;
    background-repeat: no-repeat;
    width: 100%;
    height: auto;
    padding: 30px 0;
    border-radius: 10px;
    box-shadow: 0px 0px 7px 0px rgba(189, 159, 58, 0.6);

    h2 {
      font-weight: 500;
      text-align: center;
      font-size: 22px;
    }
    h3 {
      font-weight: 400;
      font-size: 20px;
      text-align: center;
    }
    hr {
      color: var(--over-all-bg-clr);
      margin: 20px 0;
    }

    .divtwo {
      display: grid;
      grid-template-columns: 40% 15% 40%;
      column-gap: 10px;
      padding: 0 20px 0 20px;
    }

    .divthree {
      display: grid;
      width: 100%;
      grid-template-columns: 1fr;
      column-gap: 10px;
      padding: 0 20px 0 20px;
    }

    .divthreemain {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .newblock {
      display: grid;
      grid-template-columns: 1fr;
      gap: 20px;
    }

    .arrowtag {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      background-color: #3aa54d;
      box-shadow: 0px 0px 10px rgba(58, 165, 77, 0.6);
    }

    .searbarh {
      background: var(--drop-down-clr);
      border-radius: 8px;
      max-width: 100%;
      max-height: 50px;
      display: flex;
      margin-top: 10px;
      width: 100%;
      @media (max-width: 992px) {
      }

      input {
        outline: none;
        border: none;
        background: transparent;
        padding: 12px 12px;
        color: var(--white-clr);
        width: 100%;

        font-size: 14px;
        &::placeholder {
          color: var(--search-clr);
        }
        /* Styles for the .searbar when input inside it is in focus */
      }
    }

    .web3-btn {
      display: flex;
      justify-content: center;
      button {
        background-color: hsla(44, 100%, 50%, 1);
        color: #fff;
        border: 1px solid #fff;
        outline: none;
        font-family: var(--font-medium);
        border-radius: 7px;
        padding: 12px 14px;
        width: 100%;
        margin: 30px 0;
        cursor: pointer;
      }
    }

    @media (max-width: 767px) {
      width: 100%;

      .divthree {
        display: grid;
        width: 100%;
        grid-template-columns: 1fr;
        column-gap: 10px;
        padding: 0 20px 0 20px;
      }

      .web3-btn {
        display: flex;
        justify-content: center;
        button {
          background-color: hsla(44, 100%, 50%, 1);
          color: #fff;
          border: 1px solid #fff;
          outline: none;
          font-family: var(--font-medium);
          border-radius: 7px;
          padding: 12px 14px;
          width: 100%;
          margin: 30px 0;
          cursor: pointer;
        }
      }
    }
  `;

  const rewardLeftInSeconds = Number(rewardLeft);
  const secondsInADay = 86400; // 60 seconds * 60 minutes * 24 hours

  const rewardLeftInDays = rewardLeftInSeconds / secondsInADay;

  const integerPart = Math.floor(rewardLeftInDays);

  const handleCloseModal = () => {
    setTimeout(() => setStatus(null), 5000);
    setTimeout(() => {
      handleGetData();
      handleGetContractData();
    }, 2000);
  };

  const handleStake = async () => {
    try {
      if (!address) return alert("connect wallet");

      if (isBelowMinStake) {
        return alert("Minimum Stake Amount is 6 w8Bit");
      }

      setStatus({ status: "PROCESSING", message: "Staking your amount..." });
      await stakeToken(address, chain, amount);
      setStatus({ status: "SUCCESS", message: "Staked successfully" });
    } catch (error) {
      console.log(error);
      setStatus({ status: "ERROR", message: "Transaction failed" });
    } finally {
      handleCloseModal();
    }
  };

  const handleUnstake = async () => {
    try {
      if (!address) return alert("connect wallet");
      setStatus({ status: "PROCESSING", message: "Unstaking your amount..." });
      await unStakeToken(address, chain, amountU);
      setStatus({ status: "SUCCESS", message: "Unstaked successfully" });
    } catch (error) {
      console.log(error);
      setStatus({ status: "ERROR", message: "Transaction failed" });
    } finally {
      handleCloseModal();
    }
  };

  const handleClaim = async () => {
    try {
      if (!address) return alert("connect wallet");

      setStatus({
        status: "PROCESSING",
        message: "Claiming your reward. please wait...",
      });
      await claimRewards(address, chain);
      setStatus({ status: "SUCCESS", message: "Claimed successfully" });
    } catch (error: any) {
      console.log(error);
      if (error.message.includes("Reward claim lock period not passed yet")) {
        setStatus({ status: "ERROR", message: "Reward claim lock period not passed yet. " });
      } else {
        setStatus({ status: "ERROR", message: "Transaction failed" });
      }
    } finally {
      handleCloseModal();
    }
  };


  return (
    <div className="mt-3 px-3">
      <div className="d-flex justify-content-between" style={{margin:20}}>
        <div>
      <div className="d-flex justify-content-between pool_options">
        <div className="d-flex justify-content-between pools_btns">
          <div className="highlight">
            <Link to="../Staking" style={{textDecoration:'none'}}>
          <h2 style={{color:'#ccc',paddingLeft:"10px",fontSize:15,marginBottom:20}}>
          <i className="fa fa-caret-left"></i>&nbsp;
Staking / <span style={{color:'#ffba00'}}>Multichain Staking Pool 3</span>
            </h2>
            </Link>

            <h2 style={{color:'#ffba00',paddingLeft:"10px"}}>
              Multichain Staking Pool 3</h2>
          </div>
        </div>
      </div>

      <div className=" mt-0" style={{color:'#cccccc',paddingLeft:"10px",fontSize:15}}>
        Add liquidity to our Pools and earn trading fees automatically.
      </div>
      </div>

</div>

<div className="pool_list_sections ">

<div className="stakegrid">

<div className="pool_boxs">
      <h2 style={{color:'#ccc',fontSize:15}}>Total Staked</h2>
      <h2 style={{color:'#ffba00',fontSize:20}}> {new Intl.NumberFormat("en-US", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 4,
              }).format(totalStaked)}{" "}
              w8Bit</h2>

          </div>

          <div className="pool_boxs">
      <h2 style={{color:'#ccc',fontSize:15}}>Total Stakers</h2>
      <h2 style={{color:'#ffba00',fontSize:20}}> {new Intl.NumberFormat("en-US", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 4,
              }).format(totalTokenHolders)}{" "}
              </h2>

          </div>


          <div className="pool_boxs">
      <h2 style={{color:'#ccc',fontSize:15}}>APY</h2>
      <h2 style={{color:'#ffba00',fontSize:20}}>{apy} %</h2>

          </div>


          <div className="pool_boxs">
      <h2 style={{color:'#ccc',fontSize:15}}>Locking Period</h2>
      <h2 style={{color:'#ffba00',fontSize:20}}>30 Days</h2>

          </div>

         

       
     
</div>

<div className="stakingmaingridhead">
<div>

<div className="topdivchangedstyle">
        <div className="blockhead">
         
          <div className="innerstakecontainers">
            <div className="divthreemains">
              <div className="divthreemain">
                <div className="divthree">
                  <h2
                    style={{
                      textAlign: "center",
                      color: "#e7bd33",
                      fontWeight: "500",
                      fontSize: "25px",
                    }}
                  >
                    Stake w8Bit
                  </h2>
                  <hr style={{ borderColor: "#e7bd33", marginBottom: "20px" }} />
                  <p style={{fontSize:14,textAlign:'right'}}><i className="fa fa-wallet"></i> : {balance.toString()} w8Bit</p>
                  <div>
                    w8Bit Amount to Stake
                    <br />
                    <div className="searbarh">
                      <input
                        type="amount"
                        placeholder="0.00 w8Bit"
                        value={amount}
                        onChange={(e) => {
                          setAmount(e.target.value);
                          setIsBelowMinStake(Number(e.target.value) < 0);
                        }}
                      />
                      <div
                        className="searchBar-icons"
                        style={{
                          paddingTop: "7px",
                          paddingRight: "15px",
                          cursor: "pointer",
                        }}
                        onClick={() => setAmount(balance.toString())}
                      >
                        MAX
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="divthreemain">
                <div className="divthree">
                  <div className="web3-btn">
                    <button onClick={handleStake} disabled={isBelowMinStake}>
                      {isBelowMinStake ? "Min Stake Amt is 6 w8Bit" : "Stake"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="exploring">
        <div className="divisions">
          <div className="stakeblock">
            <h2
              style={{ textAlign: "center", color: "#e7bd33", fontWeight: "500", fontSize: "25px" }}
            >
              Your w8Bit Rewards
            </h2>
            <hr style={{ borderColor: "#e7bd33", marginTop: "20px", marginBottom: "50px" }} />{" "}
            <h2>
            {new Intl.NumberFormat("en-US", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 4,
              }).format(rewardAmount)}{" "}
              w8Bit
            </h2>
           
<h6 style={{marginTop:30}}>Time Left for Reward Claim</h6>
                    <div className="timer" style={{marginBottom:20}}>
    <span >{hourss} </span>&nbsp; :&nbsp; 
    <span >{minutess} </span>&nbsp; : &nbsp;
    <span >{secondss} </span>
  </div>

            <div className="web3-btn">
              <button onClick={handleClaim}>Claim Rewards</button>
            </div>
          </div>
          <div className="stakeblock">
            <h2
              style={{ textAlign: "center", color: "#e7bd33", fontWeight: "500", fontSize: "25px" }}
            >
              Your Staked w8Bit
            </h2>

            <hr style={{ borderColor: "#e7bd33", marginTop: "20px", marginBottom: "20px" }} />{" "}
            <p style={{fontSize:14,textAlign:'right'}}>Unstakeable Bal. :   {new Intl.NumberFormat("en-US", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 4,
              }).format(withdrawlbal)}{" "} w8Bit</p>

            {/* <h2>
              {new Intl.NumberFormat("en-US", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 4,
              }).format(Number(stakedAmount))}{" "}
              w8Bit
            </h2> */}

            <div>
                    w8Bit Amount to Unstake

            <div className="searbarh">
                      <input
                        type="amountUnstake"
                        placeholder="0.00 w8Bit"
                        value={amountU}
                        onChange={(f) => {
                          setAmountU(f.target.value);
                        }}
                      
                      />
                      <div
                        className="searchBar-icons"
                        style={{
                          paddingTop: "7px",
                          paddingRight: "15px",
                          cursor: "pointer",
                        }}
                        onClick={() => setAmountU(withdrawlbal.toString())}
                      >
                        MAX
                      </div>
                    </div>
                    </div>

<div className="timerclass">
<h6>Time Left for Unstake</h6>
                    <div className="timer">
    <span >{hours} </span>&nbsp; :&nbsp; 
    <span >{minutes} </span>&nbsp; : &nbsp;
    <span >{seconds} </span>
  </div>
  </div>
  <div className="web3-btn">
    <button onClick={handleUnstake} >
      {parseFloat(amountU) > withdrawlbal ? "Unstake Amount is Less Than Unstakeable" : "Unstake"}
    </button>
  </div>
          </div>
        </div>
      </div>
      </div>


      <div> 
      <div className="stakeblock">
            <h2
              style={{ textAlign: "center", color: "#e7bd33", fontWeight: "500", fontSize: "25px" }}
            >
              User Stats
            </h2>
            <hr style={{ borderColor: "#e7bd33", marginTop: "20px", marginBottom: "20px" }} />{" "}
          <p>Total w8Bit Staked : <span style={{fontWeight:900}}>{new Intl.NumberFormat("en-US", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 4,
              }).format(stakedAmount)}{" "} w8Bit</span></p>
          <p>Total Claimed Reward : <span style={{fontWeight:900}}>{new Intl.NumberFormat("en-US", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 4,
              }).format(earned)}{" "} w8Bit</span></p>
          <p>w8Bit Holding : <span style={{fontWeight:900}}>{new Intl.NumberFormat("en-US", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 4,
              }).format(balance)}{" "} w8Bit</span></p>

            
          </div>


          <div style={{marginTop:40}}>
    <h6 style={{fontWeight:900}}>User Transaction History</h6>
    {tradeHistory.length === 0 ? (
    <div>No Trades Yet</div>
) : (
        <table className="farm_table_view">
            <thead>
                <tr>
                    <th>Timestamp</th>
                    <th>Type</th>
                    <th>Amount</th>
                </tr>
            </thead>
            <tbody>
                {tradeHistory.slice(-10).reverse().map((trade, index) => (
                    <tr key={index}>
                        <td>{new Date(parseInt(trade.timestamp.toString()) * 1000).toLocaleString()}</td>
                        <td style={{
                            textTransform:'capitalize',
                            color: 
                                trade.actionType === "stake" ? "#15bf26" : 
                                trade.actionType === "unstake" ? "red" : 
                                trade.actionType === "claim" ? "#ffba00" : "inherit" 
                        }}>{trade.actionType}</td>
                        <td>{(parseFloat(formatEther(trade.amount)).toFixed(2))} w8Bit</td>
                    </tr>
                ))}
            </tbody>
        </table>
   
)}

</div>


      </div>


    
      </div>
   
        </div>



      <Modal
        show={chainModal}
        onHide={() => {
          setChainModal(false);
        }}
        centered
      >
        <div className="modal-section p-3">
          <div className="d-flex justify-content-between">
            <div className="d-flex flex-column">
              <label>
                <h3 style={{ color: "#fff" }}>Select a token</h3>
              </label>

              <label>You can search and select any token by Name, CA, Symbol at ProDex</label>
            </div>

            <div>
              <button
                className="btn"
                onClick={() => {
                  setChainModal(false);
                }}
              >
                <i className="fa fa-times" style={{ color: "#fff" }} aria-hidden="true"></i>
              </button>
            </div>
          </div>
          <div className="modal_search">
            <input type="text" placeholder="search by token name or address" />
            <i className="fa fa-search" aria-hidden="true"></i>
          </div>

          <div className="mt-4 chain_list_section">
            <span className="chain_select">
              <img src={eth} width={20} />
              ETH
            </span>

            <span className="chain_select">
              <img src={Eightbitchain} width={20} />
              w8Bit
            </span>
          </div>

          <div className="mt-3">
            <div className="modal_tabs">
              <button className="btn active_modal_tabs">All</button>

              <button className="btn">Imported</button>
            </div>
          </div>

          <div className="text-center mt-3 imported_tokens">
            <label>No results found.</label>
          </div>
        </div>
      </Modal>

      {status && (
        <div className="modal-backdrop">
          <div className="modals">
            <h3 className={status.status.toLowerCase()}>{status.status}</h3>
            <p>{status.message}</p>
          </div>
        </div>
      )}
    </div>
  );
}
