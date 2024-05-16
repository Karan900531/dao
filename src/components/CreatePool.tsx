import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Modal } from "react-bootstrap";
import Dropdown from "./Dropdown";
import tether from "../Assets/tether.png";
import eth from "../assets/eth.png";
import bnb from "../Assets/bnb.png";
import Eightbitchain from "../assets/8bitchain.png";
import { useAccount, useChainId } from "wagmi";
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
unStakeToken,
getUserTradeHistory,
getWithdrawableBalance,
} from "../utils/methods";
import "./staking.scss";
import {
getApy as APYNative,
getTokenHolders as HolderNative,
getTokenStaked as StakedNative
} from "../utils/methodNative";
import {
getApy as APYNative2,
getTokenHolders as HolderNative2,
getTokenStaked as StakedNative2
} from "../utils/methodNative2";
import {
  getApy as APYNative3,
  getTokenHolders as HolderNative3,
  getTokenStaked as StakedNative3
  } from "../utils/methodNative3";


  import {
   getApy as APYNative4,
   getTokenHolders as HolderNative4,
   getTokenStaked as StakedNative4
   } from "../utils/method2";


  import {
   getApy as APYNative6,
   getTokenHolders as HolderNative6,
   getTokenStaked as StakedNative6
   } from "../utils/methodOld1";

   import {
      getApy as APYNative5,
      getTokenHolders as HolderNative5,
      getTokenStaked as StakedNative5
      } from "../utils/method3";


   import {
      getApy as APYNative7,
      getTokenHolders as HolderNative7,
      getTokenStaked as StakedNative7
      } from "../utils/methodOld2";

export default function Farm() {
const [pooltabs, setPoolTabs] = useState("All");
const [poolView, setPoolView] = useState("Grid");
const [chainModal, setChainModal] = useState(false);
const [filter1, setFilter1] = useState("Active");
const [filter2, setFilter2] = useState("All");
const [View, setView] = useState("");
const [ROIModal, setROIModal] = useState(false);
const [amount, setAmount] = useState("");
const [amountU, setAmountU] = useState("");
const { address } = useAccount();
const chain = useChainId();
const [stakedAmount, setStakedAmount] = useState(0);
const [rewardAmount, setRewardAmount] = useState(0.0000);
const [withdrawlbal, setWithdraw] = useState(0);
const [minunstake, setMinunstake] = useState(0);
const [balance, setBalance] = useState(0);
const [totalStaked, setTotalStaked] = useState(0);
const [apy, setApy] = useState(0);
const [totalTokenHolders, setTotalTokenHolders] = useState(0);
const [totalStaked2, setTotalStaked2] = useState(0);
const [apy2, setApy2] = useState(0);
const [totalTokenHolders2, setTotalTokenHolders2] = useState(0);
const [totalStaked3, setTotalStaked3] = useState(0);
const [apy3, setApy3] = useState(0);
const [totalTokenHolders3, setTotalTokenHolders3] = useState(0);
const [totalStaked4, setTotalStaked4] = useState(0);
const [apy4, setApy4] = useState(0);
const [totalTokenHolders4, setTotalTokenHolders4] = useState(0);
const [totalStaked5, setTotalStaked5] = useState(0);
const [apy5, setApy5] = useState(0);
const [totalTokenHolders5, setTotalTokenHolders5] = useState(0);
const [totalStaked7, setTotalStaked7] = useState(0);
const [apy7, setApy7] = useState(0);
const [totalTokenHolders7, setTotalTokenHolders7] = useState(0);
const [totalStaked8, setTotalStaked8] = useState(0);
const [apy8, setApy8] = useState(0);
const [totalTokenHolders8, setTotalTokenHolders8] = useState(0);
const [totalStaked6, setTotalStaked6] = useState(0);
const [apy6, setApy6] = useState(0);
const [totalTokenHolders6, setTotalTokenHolders6] = useState(0);
const [rewardLeft, setRewardLeft] = useState(0);
const [earned, setEarned] = useState(0);
const [isBelowMinStake, setIsBelowMinStake] = useState(false);
const [tradeHistory, setTradeHistory] = useState<{ actionType: any; amount: any; timestamp: any }[]>([]);

const fetchUserTradeHistory = useCallback(async () => {
try {
if (!address || !chain) return;
const history = await getUserTradeHistory(address, chain);
console.log("History fetched:", history); 
setTradeHistory(history);
} catch (error) {
console.log(error);
}
}, [address, chain]);
useEffect(() => {
fetchUserTradeHistory();
}, [fetchUserTradeHistory]);

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

const formatTime = (timeInSeconds:any) => {
const hours = Math.floor(timeInSeconds / 3600);
const minutes = Math.floor((timeInSeconds % 3600) / 60);
const seconds = timeInSeconds % 60;

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
const handleGetContractData = useCallback(async () => {
try {
setTotalTokenHolders(await getTokenHolders(chain));
setTotalStaked(await getTokenStaked(chain));
setApy(await getApy(chain));
setTotalTokenHolders2(await HolderNative(chain));
setTotalStaked2(await StakedNative(chain));
setApy2(await APYNative(chain));
setTotalTokenHolders3(await HolderNative2(chain));
setTotalStaked3(await StakedNative2(chain));
setApy3(await APYNative2(chain));
setTotalTokenHolders5(await HolderNative4(chain));
setTotalStaked5(await StakedNative4(chain));
setApy5(await APYNative4(chain));
setTotalTokenHolders6(await HolderNative5(chain));
setTotalStaked6(await StakedNative5(chain));
setApy6(await APYNative5(chain));
setTotalTokenHolders7(await HolderNative6(chain));
setTotalStaked7(await StakedNative6(chain));
setApy7(await APYNative6(chain));
setTotalTokenHolders8(await HolderNative7(chain));
setTotalStaked8(await StakedNative7(chain));
setApy8(await APYNative7(chain));
setTotalTokenHolders4(await HolderNative3(chain));
setTotalStaked4(await StakedNative3(chain));
setApy4(await APYNative3(chain));


} catch (error) {
console.log(error);
}
}, [chain]);
useEffect(() => {
handleGetContractData();
}, [ handleGetContractData]);
const navigate = useNavigate();
useEffect(() => {
console.log(View);
}, [View]);
const listdeposit = ["AVG ARP", "AVG ARP", "Staked TVL", "Staked TVL"];

const renderInclusivePools = () => {
  if (chain === 56  || chain === 97) {
      return (
         <>  <div className="pool_box" >
        <div style={{
  display:'flex',
  justifyContent:'space-between',
  alignItems:'center',
  padding:5,
marginBottom:15,
  borderBottom:'1px solid #ffba00'
}}>

<div className="pool-head2" style={{width:'60%',textAlign:'left'}}>Special Staking Pool 30 Days</div>

<div style={{ width: "fit-content" }}>
            <img  src={Eightbitchain} width={55} style={{borderRadius:5}}/>
          </div>


</div>
         <div>
            <div className="highlight" style={{marginLeft:10}}>
               <label className="avg_pool highlight__text">APY</label>
       
            </div>
            <div style={{marginLeft:10}}>
               <label className="pool_percentage" style={{marginTop:-5,marginBottom:10}}>{apy} %</label>
            </div>
            <div className="stake_box" style={{margin:'10px 0'}}>
            <table style={{ fontSize: "14px", width: "100%" }}>
            <tr>
              <td
                style={{
                  textDecorationLine: "underline",
                  textDecorationStyle: "dotted",
                }}
              >
                Total Staked
              </td>
              <td align="right" style={{ color: "#ffba00" }}>
              {new Intl.NumberFormat("en-US", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 4,
                  }).format(totalStaked)}{" "}
                  w8Bit
              </td>
            
            </tr>

         
            <tr>
              <td
                style={{
                  textDecorationLine: "underline",
                  textDecorationStyle: "dotted",
                }}
              >
                Total Stakers
              </td>
              <td align="right">{new Intl.NumberFormat("en-US", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 4,
                  }).format(totalTokenHolders)}{" "}</td>
            </tr>
            <tr>
              <td
                style={{
                  textDecorationLine: "underline",
                  textDecorationStyle: "dotted",
                }}
              >
                Locking Period
              </td>
              <td align="right">30 Days</td>
            </tr>
            <tr>
              <td
                style={{
                  textDecorationLine: "underline",
                  textDecorationStyle: "dotted",
                }}
              >
                Emergency Withdraw
              </td>
              <td align="right">No</td>
            </tr>
           
          </table>
    
            
            </div>
            <div className="mt-3">
               <Link  to="/Staking/One" style={{cursor:'pointer'}}>
                  <button className="btn-primary" disabled style={{cursor:'pointer'}}>
                  <i className="fa fa-eye" style={{marginRight:5}}></i>
               Coming Soon
                  </button>
              
               </Link>
            </div>
         </div>
      </div>


      {/* <div className="pool_box">
         <div className="d-flex justify-content-between" style={{ display:'flex',justifyContent:'space-between' }} style={{ display:'flex',justifyContent:'space-between' }}>
            <div className="d-flex" style={{ display:'flex' }}>
               <div>
                  <img src={Eightbitchain} width={25} />
               </div>
               <div>
                  <label className="conins_name_label">Native Staking Pool</label>
                  <label className="fees_label">60 Days</label>
               </div>
            </div>
            <div>
               {}
               <button
                  className="btn options_btn"
                  onClick={() => {
               setROIModal(true);
               }}
               >
               <i className="fa fa-ellipsis-h"></i>
               </button>
            </div>
         </div>
         <div>
            <div className="highlight">
               <label className="avg_pool highlight__text">APY</label>
               {}
            </div>
            <div>
               <label className="pool_percentage" style={{marginTop:-5,marginBottom:10}}>{apy5} %</label>
            </div>
            <div className="d-flex justify-content-between" style={{ display:'flex',justifyContent:'space-between' }}>
               <div className="d-flex flex-column price_section">
                  <label>Total Staked</label>
                  <label>{new Intl.NumberFormat("en-US", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 4,
                  }).format(totalStaked5)}{" "}
                  w8Bit</label>
               </div>
               <div className="d-flex flex-column price_section">
                  <label style={{textAlign:'right'}}>Total Stakers</label>
                  <label style={{textAlign:'right'}}>{new Intl.NumberFormat("en-US", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 4,
                  }).format(totalTokenHolders5)}{" "}</label>
               </div>
            </div>
            <hr style={{ color: "#fff" }} />
            <div className="d-flex justify-content-between" style={{ display:'flex',justifyContent:'space-between' }}>
               <div className="d-flex flex-column price_section">
                  <label>Locking Period</label>
                  <label >60 Days</label>
               </div>
               <div className="d-flex flex-column price_section">
                  <label style={{textAlign:'right'}}>Emergency Withdraw</label>
                  <label style={{textAlign:'right'}}>No</label>
               </div>
            </div>
            <div className="mt-3">
               <Link className="add_liquidity" to="/Staking/Two">
               <i className="fa fa-eye"></i>
               Coming Soon
               </Link>
            </div>
         </div>
      </div> */}

      {/* <div className="pool_box">
         <div className="d-flex justify-content-between" style={{ display:'flex',justifyContent:'space-between' }}>
            <div className="d-flex">
               <div>
                  <img src={Eightbitchain} width={25} />
               </div>
               <div>
                  <label className="conins_name_label">Native Staking Pool</label>
                  <label className="fees_label">90 Days</label>
               </div>
            </div>
            <div>
               {}
               <button
                  className="btn options_btn"
                  onClick={() => {
               setROIModal(true);
               }}
               >
               <i className="fa fa-ellipsis-h"></i>
               </button>
            </div>
         </div>
         <div>
            <div className="highlight">
               <label className="avg_pool highlight__text">APY</label>
               {}
            </div>
            <div>
               <label className="pool_percentage" style={{marginTop:-5,marginBottom:10}}>{apy6} %</label>
            </div>
            <div className="d-flex justify-content-between" style={{ display:'flex',justifyContent:'space-between' }}>
               <div className="d-flex flex-column price_section">
                  <label>Total Staked</label>
                  <label>{new Intl.NumberFormat("en-US", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 4,
                  }).format(totalStaked6)}{" "}
                  w8Bit</label>
               </div>
               <div className="d-flex flex-column price_section">
                  <label style={{textAlign:'right'}}>Total Stakers</label>
                  <label style={{textAlign:'right'}}>{new Intl.NumberFormat("en-US", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 4,
                  }).format(totalTokenHolders6)}{" "}</label>
               </div>
            </div>
            <hr style={{ color: "#fff" }} />
            <div className="d-flex justify-content-between" style={{ display:'flex',justifyContent:'space-between' }}>
               <div className="d-flex flex-column price_section">
                  <label>Locking Period</label>
                  <label >90 Days</label>
               </div>
               <div className="d-flex flex-column price_section">
                  <label style={{textAlign:'right'}}>Emergency Withdraw</label>
                  <label style={{textAlign:'right'}}>No</label>
               </div>
            </div>
            <div className="mt-3">
               <Link className="add_liquidity" to="/Staking/Three">
               <i className="fa fa-eye"></i>
               Coming Soon
               </Link>
            </div>
         </div>
      </div>




      <div className="pool_box">
         <div className="d-flex justify-content-between" style={{ display:'flex',justifyContent:'space-between' }}>
            <div className="d-flex">
               <div>
                  <img src={Eightbitchain} width={25} />
               </div>
               <div>
                  <label className="conins_name_label">Old Native Staking Pool</label>
                  <label className="fees_label">20 Days</label>
               </div>
            </div>
            <div>
               {}
               <button
                  className="btn options_btn"
                  onClick={() => {
               setROIModal(true);
               }}
               >
               <i className="fa fa-ellipsis-h"></i>
               </button>
            </div>
         </div>
         <div>
            <div className="highlight">
               <label className="avg_pool highlight__text">APY</label>
               {}
            </div>
            <div>
               <label className="pool_percentage" style={{marginTop:-5,marginBottom:10}}>{apy7} %</label>
            </div>
            <div className="d-flex justify-content-between" style={{ display:'flex',justifyContent:'space-between' }}>
               <div className="d-flex flex-column price_section">
                  <label>Total Staked</label>
                  <label>{new Intl.NumberFormat("en-US", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 4,
                  }).format(totalStaked7)}{" "}
                  w8Bit</label>
               </div>
               <div className="d-flex flex-column price_section">
                  <label style={{textAlign:'right'}}>Total Stakers</label>
                  <label style={{textAlign:'right'}}>{new Intl.NumberFormat("en-US", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 4,
                  }).format(totalTokenHolders7)}{" "}</label>
               </div>
            </div>
            <hr style={{ color: "#fff" }} />
            <div className="d-flex justify-content-between" style={{ display:'flex',justifyContent:'space-between' }}>
               <div className="d-flex flex-column price_section">
                  <label>Locking Period</label>
                  <label >20 Days</label>
               </div>
               <div className="d-flex flex-column price_section">
                  <label style={{textAlign:'right'}}>Emergency Withdraw</label>
                  <label style={{textAlign:'right'}}>Yes</label>
               </div>
            </div>
            <div className="mt-3">
               <Link className="add_liquidity" to="/Staking/Four">
               <i className="fa fa-eye"></i>
               Coming Soon
               </Link>
            </div>
         </div>
      </div> */}

      <div className="pool_box">
      <div style={{
  display:'flex',
  justifyContent:'space-between',
  alignItems:'center',
  padding:5,
marginBottom:15,
  borderBottom:'1px solid #ffba00'
}}>

<div className="pool-head2" style={{width:'60%',textAlign:'left'}}>2X NFT Staking Pool 20 Days</div>

<div style={{ width: "fit-content" }}>
            <img  src={Eightbitchain} width={55} style={{borderRadius:5}}/>
          </div>


</div>
         <div>
            <div className="highlight">
               <label className="avg_pool highlight__text">APY</label>
               {}
            </div>
            <div>
               <label className="pool_percentage" style={{marginTop:-5,marginBottom:10}}>{apy8} %</label>
            </div>
            <div className="stake_box" style={{margin:'10px 0'}}>
            <table style={{ fontSize: "14px", width: "100%" }}>
            <tr>
              <td
                style={{
                  textDecorationLine: "underline",
                  textDecorationStyle: "dotted",
                }}
              >
                Total Staked
              </td>
              <td align="right" style={{ color: "#ffba00" }}>
              {new Intl.NumberFormat("en-US", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 4,
                  }).format(totalStaked8)}{" "}
                  w8Bit
              </td>
            
            </tr>

         
            <tr>
              <td
                style={{
                  textDecorationLine: "underline",
                  textDecorationStyle: "dotted",
                }}
              >
                Total Stakers
              </td>
              <td align="right">{new Intl.NumberFormat("en-US", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 4,
                  }).format(totalTokenHolders8)}{" "}</td>
            </tr>
            <tr>
              <td
                style={{
                  textDecorationLine: "underline",
                  textDecorationStyle: "dotted",
                }}
              >
                Locking Period
              </td>
              <td align="right">20 Days</td>
            </tr>
            <tr>
              <td
                style={{
                  textDecorationLine: "underline",
                  textDecorationStyle: "dotted",
                }}
              >
                Emergency Withdraw
              </td>
              <td align="right">Yes</td>
            </tr>
           
          </table>
    
            
            </div>
            <Link  to="/Staking/Five" style={{cursor:'pointer'}}>
                  <button className="btn-primary" disabled style={{cursor:'pointer'}}>
                  <i className="fa fa-eye" style={{marginRight:5}}></i>
               Coming Soon
                  </button>
              
               </Link>
         </div>
      </div>
         </>
      );
  }
  return null; 
};


const renderListInclusivePools = () => {
   if (chain === 56  || chain === 97) {
       return (
           <>
               <tr>
                   <td>
                       <div className="d-flex flex-column" style={{ display:'flex',flexDirection:'column'}}>
                           <div className="d-flex">
                               <div>
                                   <img src={Eightbitchain} width={35} />
                               </div>
                               <div>
                                   <label className="conins_name_label">Native Staking Pool</label>
                                   <label className="fees_label">30 Days</label>
                               </div>
                           </div>
                       </div>
                   </td>
                   <td>{new Intl.NumberFormat("en-US", {
                       minimumFractionDigits: 0,
                       maximumFractionDigits: 4,
                   }).format(totalStaked)}{" "}
                       w8Bit
                   </td>
                   <td style={{ color: "#ffba00" }}>{apy} %</td>
                   <td>{new Intl.NumberFormat("en-US", {
                       minimumFractionDigits: 0,
                       maximumFractionDigits: 4,
                   }).format(totalTokenHolders)}{" "}
                   </td>
                   <td>No</td>
                   <td>30 Days</td>
                   <td>
                       <div className="farm_table_action_btn">
                           <button
                               onClick={() => {
                                   navigate("/Staking/One");
                               }}
                           >
                               <i className="fa fa-eye" aria-hidden="true"></i>
                           </button>
                       </div>
                   </td>
               </tr>
               <tr>
                   <td>
                       <div className="d-flex flex-column" style={{ display:'flex',flexDirection:'column'}}>
                           <div className="d-flex">
                               <div>
                                   <img src={Eightbitchain} width={35} />
                               </div>
                               <div>
                                   <label className="conins_name_label">Native Staking Pool</label>
                                   <label className="fees_label">60 Days</label>
                               </div>
                           </div>
                       </div>
                   </td>
                   <td>{new Intl.NumberFormat("en-US", {
                       minimumFractionDigits: 0,
                       maximumFractionDigits: 4,
                   }).format(totalStaked5)}{" "}
                       w8Bit
                   </td>
                   <td style={{ color: "#ffba00" }}>{apy5} %</td>
                   <td>{new Intl.NumberFormat("en-US", {
                       minimumFractionDigits: 0,
                       maximumFractionDigits: 4,
                   }).format(totalTokenHolders5)}{" "}
                   </td>
                   <td>No</td>
                   <td>60 Days</td>
                   <td>
                       <div className="farm_table_action_btn">
                           <button
                               onClick={() => {
                                   navigate("/Staking/Two");
                               }}
                           >
                               <i className="fa fa-eye" aria-hidden="true"></i>
                           </button>
                       </div>
                   </td>
               </tr>
               <tr>
                   <td>
                       <div className="d-flex flex-column" style={{ display:'flex',flexDirection:'column'}}>
                           <div className="d-flex">
                               <div>
                                   <img src={Eightbitchain} width={35} />
                               </div>
                               <div>
                                   <label className="conins_name_label">Native Staking Pool</label>
                                   <label className="fees_label">90 Days</label>
                               </div>
                           </div>
                       </div>
                   </td>
                   <td>{new Intl.NumberFormat("en-US", {
                       minimumFractionDigits: 0,
                       maximumFractionDigits: 4,
                   }).format(totalStaked6)}{" "}
                       w8Bit
                   </td>
                   <td style={{ color: "#ffba00" }}>{apy6} %</td>
                   <td>{new Intl.NumberFormat("en-US", {
                       minimumFractionDigits: 0,
                       maximumFractionDigits: 4,
                   }).format(totalTokenHolders6)}{" "}
                   </td>
                   <td>No</td>
                   <td>90 Days</td>
                   <td>
                       <div className="farm_table_action_btn">
                           <button
                               onClick={() => {
                                   navigate("/Staking/Three");
                               }}
                           >
                               <i className="fa fa-eye" aria-hidden="true"></i>
                           </button>
                       </div>
                   </td>
               </tr>

               <tr>
                   <td>
                       <div className="d-flex flex-column" style={{ display:'flex',flexDirection:'column'}}>
                           <div className="d-flex">
                               <div>
                                   <img src={Eightbitchain} width={35} />
                               </div>
                               <div>
                                   <label className="conins_name_label">Old Staking Pool</label>
                                   <label className="fees_label">20 Days</label>
                               </div>
                           </div>
                       </div>
                   </td>
                   <td>{new Intl.NumberFormat("en-US", {
                       minimumFractionDigits: 0,
                       maximumFractionDigits: 4,
                   }).format(totalStaked7)}{" "}
                       w8Bit
                   </td>
                   <td style={{ color: "#ffba00" }}>{apy7} %</td>
                   <td>{new Intl.NumberFormat("en-US", {
                       minimumFractionDigits: 0,
                       maximumFractionDigits: 4,
                   }).format(totalTokenHolders7)}{" "}
                   </td>
                   <td>No</td>
                   <td>90 Days</td>
                   <td>
                       <div className="farm_table_action_btn">
                           <button
                               onClick={() => {
                                   navigate("/Staking/Four");
                               }}
                           >
                               <i className="fa fa-eye" aria-hidden="true"></i>
                           </button>
                       </div>
                   </td>
               </tr>

               <tr>
                   <td>
                       <div className="d-flex flex-column" style={{ display:'flex',flexDirection:'column'}}>
                           <div className="d-flex">
                               <div>
                                   <img src={Eightbitchain} width={35} />
                               </div>
                               <div>
                                   <label className="conins_name_label">Old Staking Pool</label>
                                   <label className="fees_label">20 Days</label>
                               </div>
                           </div>
                       </div>
                   </td>
                   <td>{new Intl.NumberFormat("en-US", {
                       minimumFractionDigits: 0,
                       maximumFractionDigits: 4,
                   }).format(totalStaked8)}{" "}
                       w8Bit
                   </td>
                   <td style={{ color: "#ffba00" }}>{apy8} %</td>
                   <td>{new Intl.NumberFormat("en-US", {
                       minimumFractionDigits: 0,
                       maximumFractionDigits: 4,
                   }).format(totalTokenHolders8)}{" "}
                   </td>
                   <td>No</td>
                   <td>20 Days</td>
                   <td>
                       <div className="farm_table_action_btn">
                           <button
                               onClick={() => {
                                   navigate("/Staking/Five");
                               }}
                           >
                               <i className="fa fa-eye" aria-hidden="true"></i>
                           </button>
                       </div>
                   </td>
               </tr>
           </>
       );
   }
   return null;
};



const renderNoPools = () => {
   if (chain !== 56 &&  chain !== 8088 && chain !== 97) {
       return (
          <>
            <div style={{textAlign:'center',width:'100%',margin:50}}>
              No Pools Found
            </div>
            
          </>
       );
   }
   return null; 
 };

 
const renderExclusivePools = () => {
  if (chain === 8088) {
      return (
         <> 
         
         <div className="pool_box">
      <div style={{
  display:'flex',
  justifyContent:'space-between',
  alignItems:'center',
  padding:5,
marginBottom:15,
  borderBottom:'1px solid #ffba00'
}}>

<div className="pool-head2" style={{width:'60%',textAlign:'left'}}>Native Staking Pool 10 Days</div>

<div style={{ width: "fit-content" }}>
            <img  src={Eightbitchain} width={55} style={{borderRadius:5}}/>
          </div>


</div>
         <div>
            <div className="highlight">
               <label className="avg_pool highlight__text">APY</label>
               {}
            </div>
            <div>
               <label className="pool_percentage" style={{marginTop:-5,marginBottom:10}}>{apy2} %</label>
            </div>
            <div className="stake_box" style={{margin:'10px 0'}}>
            <table style={{ fontSize: "14px", width: "100%" }}>
            <tr>
              <td
                style={{
                  textDecorationLine: "underline",
                  textDecorationStyle: "dotted",
                }}
              >
                Total Staked
              </td>
              <td align="right" style={{ color: "#ffba00" }}>
              {new Intl.NumberFormat("en-US", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 4,
                  }).format(totalStaked2)}{" "}
                  w8Bit
              </td>
            
            </tr>

         
            <tr>
              <td
                style={{
                  textDecorationLine: "underline",
                  textDecorationStyle: "dotted",
                }}
              >
                Total Stakers
              </td>
              <td align="right">{new Intl.NumberFormat("en-US", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 4,
                  }).format(totalTokenHolders2)}{" "}</td>
            </tr>
            <tr>
              <td
                style={{
                  textDecorationLine: "underline",
                  textDecorationStyle: "dotted",
                }}
              >
                Locking Period
              </td>
              <td align="right">10 Days</td>
            </tr>
            <tr>
              <td
                style={{
                  textDecorationLine: "underline",
                  textDecorationStyle: "dotted",
                }}
              >
                Emergency Withdraw
              </td>
              <td align="right">Yes</td>
            </tr>
           
          </table>
    
            
            </div>
            <Link  to="/Staking/OneNative" style={{cursor:'pointer'}}>
                  <button className="btn-primary" disabled style={{cursor:'pointer'}}>
                  <i className="fa fa-eye" style={{marginRight:5}}></i>
               Coming Soon
                  </button>
              
               </Link>
         </div>
      </div>

      <div className="pool_box">
      <div style={{
  display:'flex',
  justifyContent:'space-between',
  alignItems:'center',
  padding:5,
marginBottom:15,
  borderBottom:'1px solid #ffba00'
}}>

<div className="pool-head2" style={{width:'60%',textAlign:'left'}}>Native Staking Pool 30 Days</div>

<div style={{ width: "fit-content" }}>
            <img  src={Eightbitchain} width={55} style={{borderRadius:5}}/>
          </div>


</div>
         <div>
            <div className="highlight">
               <label className="avg_pool highlight__text">APY</label>
               {}
            </div>
            <div>
               <label className="pool_percentage" style={{marginTop:-5,marginBottom:10}}>{apy3} %</label>
            </div>
            <div className="stake_box" style={{margin:'10px 0'}}>
            <table style={{ fontSize: "14px", width: "100%" }}>
            <tr>
              <td
                style={{
                  textDecorationLine: "underline",
                  textDecorationStyle: "dotted",
                }}
              >
                Total Staked
              </td>
              <td align="right" style={{ color: "#ffba00" }}>
              {new Intl.NumberFormat("en-US", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 4,
                  }).format(totalStaked3)}{" "}
                  w8Bit
              </td>
            
            </tr>

         
            <tr>
              <td
                style={{
                  textDecorationLine: "underline",
                  textDecorationStyle: "dotted",
                }}
              >
                Total Stakers
              </td>
              <td align="right">{new Intl.NumberFormat("en-US", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 4,
                  }).format(totalTokenHolders3)}{" "}</td>
            </tr>
            <tr>
              <td
                style={{
                  textDecorationLine: "underline",
                  textDecorationStyle: "dotted",
                }}
              >
                Locking Period
              </td>
              <td align="right">30 Days</td>
            </tr>
            <tr>
              <td
                style={{
                  textDecorationLine: "underline",
                  textDecorationStyle: "dotted",
                }}
              >
                Emergency Withdraw
              </td>
              <td align="right">Yes</td>
            </tr>
           
          </table>
    
            
            </div>
            <Link  to="/Staking/TwoNative" style={{cursor:'pointer'}}>
                  <button className="btn-primary" disabled style={{cursor:'pointer'}}>
                  <i className="fa fa-eye" style={{marginRight:5}}></i>
               Coming Soon
                  </button>
              
               </Link>
         </div>
      </div>

      <div className="pool_box">
      <div style={{
  display:'flex',
  justifyContent:'space-between',
  alignItems:'center',
  padding:5,
marginBottom:15,
  borderBottom:'1px solid #ffba00'
}}>

<div className="pool-head2" style={{width:'60%',textAlign:'left'}}>Native Staking Pool 50 Days</div>

<div style={{ width: "fit-content" }}>
            <img  src={Eightbitchain} width={55} style={{borderRadius:5}}/>
          </div>


</div>
         <div>
            <div className="highlight">
               <label className="avg_pool highlight__text">APY</label>
               {}
            </div>
            <div>
               <label className="pool_percentage" style={{marginTop:-5,marginBottom:10}}>{apy4} %</label>
            </div>
            <div className="stake_box" style={{margin:'10px 0'}}>
            <table style={{ fontSize: "14px", width: "100%" }}>
            <tr>
              <td
                style={{
                  textDecorationLine: "underline",
                  textDecorationStyle: "dotted",
                }}
              >
                Total Staked
              </td>
              <td align="right" style={{ color: "#ffba00" }}>
              {new Intl.NumberFormat("en-US", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 4,
                  }).format(totalStaked4)}{" "}
                  w8Bit
              </td>
            
            </tr>

         
            <tr>
              <td
                style={{
                  textDecorationLine: "underline",
                  textDecorationStyle: "dotted",
                }}
              >
                Total Stakers
              </td>
              <td align="right">{new Intl.NumberFormat("en-US", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 4,
                  }).format(totalTokenHolders4)}{" "}</td>
            </tr>
            <tr>
              <td
                style={{
                  textDecorationLine: "underline",
                  textDecorationStyle: "dotted",
                }}
              >
                Locking Period
              </td>
              <td align="right">50 Days</td>
            </tr>
            <tr>
              <td
                style={{
                  textDecorationLine: "underline",
                  textDecorationStyle: "dotted",
                }}
              >
                Emergency Withdraw
              </td>
              <td align="right">Yes</td>
            </tr>
           
          </table>
    
            
            </div>
            <Link  to="/Staking/ThreeNative" style={{cursor:'pointer'}}>
                  <button className="btn-primary" disabled style={{cursor:'pointer'}}>
                  <i className="fa fa-eye" style={{marginRight:5}}></i>
               Coming Soon
                  </button>
              
               </Link>
         </div>
      </div>
         </>
      );
  }
  return null; 
};


const renderListExclusivePools = () => {
   if (chain === 8088) {
       return (
           <>
               <tr>
                   <td>
                       <div className="d-flex flex-column" style={{ display:'flex',flexDirection:'column'}}>
                           <div className="d-flex">
                               <div>
                                   <img src={Eightbitchain} width={35} />
                               </div>
                               <div>
                                   <label className="conins_name_label">Native Staking Pool</label>
                                   <label className="fees_label">30 Days</label>
                               </div>
                           </div>
                       </div>
                   </td>
                   <td>{new Intl.NumberFormat("en-US", {
                       minimumFractionDigits: 0,
                       maximumFractionDigits: 4,
                   }).format(totalStaked2)}{" "}
                       w8Bit
                   </td>
                   <td style={{ color: "#ffba00" }}>{apy2} %</td>
                   <td>{new Intl.NumberFormat("en-US", {
                       minimumFractionDigits: 0,
                       maximumFractionDigits: 4,
                   }).format(totalTokenHolders2)}{" "}
                   </td>
                   <td>No</td>
                   <td>30 Days</td>
                   <td>
                       <div className="farm_table_action_btn">
                           <button
                               onClick={() => {
                                   navigate("/Staking/OneNative");
                               }}
                           >
                               <i className="fa fa-eye" aria-hidden="true"></i>
                           </button>
                       </div>
                   </td>
               </tr>
               <tr>
                   <td>
                       <div className="d-flex flex-column" style={{ display:'flex',flexDirection:'column'}}>
                           <div className="d-flex">
                               <div>
                                   <img src={Eightbitchain} width={35} />
                               </div>
                               <div>
                                   <label className="conins_name_label">Native Staking Pool</label>
                                   <label className="fees_label">60 Days</label>
                               </div>
                           </div>
                       </div>
                   </td>
                   <td>{new Intl.NumberFormat("en-US", {
                       minimumFractionDigits: 0,
                       maximumFractionDigits: 4,
                   }).format(totalStaked3)}{" "}
                       w8Bit
                   </td>
                   <td style={{ color: "#ffba00" }}>{apy3} %</td>
                   <td>{new Intl.NumberFormat("en-US", {
                       minimumFractionDigits: 0,
                       maximumFractionDigits: 4,
                   }).format(totalTokenHolders3)}{" "}
                   </td>
                   <td>No</td>
                   <td>60 Days</td>
                   <td>
                       <div className="farm_table_action_btn">
                           <button
                               onClick={() => {
                                   navigate("/Staking/TwoNative");
                               }}
                           >
                               <i className="fa fa-eye" aria-hidden="true"></i>
                           </button>
                       </div>
                   </td>
               </tr>
               <tr>
                   <td>
                       <div className="d-flex flex-column" style={{ display:'flex',flexDirection:'column'}}>
                           <div className="d-flex">
                               <div>
                                   <img src={Eightbitchain} width={35} />
                               </div>
                               <div>
                                   <label className="conins_name_label">Native Staking Pool</label>
                                   <label className="fees_label">90 Days</label>
                               </div>
                           </div>
                       </div>
                   </td>
                   <td>{new Intl.NumberFormat("en-US", {
                       minimumFractionDigits: 0,
                       maximumFractionDigits: 4,
                   }).format(totalStaked4)}{" "}
                       w8Bit
                   </td>
                   <td style={{ color: "#ffba00" }}>{apy4} %</td>
                   <td>{new Intl.NumberFormat("en-US", {
                       minimumFractionDigits: 0,
                       maximumFractionDigits: 4,
                   }).format(totalTokenHolders4)}{" "}
                   </td>
                   <td>No</td>
                   <td>90 Days</td>
                   <td>
                       <div className="farm_table_action_btn">
                           <button
                               onClick={() => {
                                   navigate("/Staking/ThreeNative");
                               }}
                           >
                               <i className="fa fa-eye" aria-hidden="true"></i>
                           </button>
                       </div>
                   </td>
               </tr>
           </>
       );
   }
   return null;
};


return (
<div >
   <div style={{marginLeft:20}}>
<h2 className="dashboard-heading" style={{marginTop:20,marginBottom:15}}>Staking 
</h2>
<div>
     
<p style={{fontSize:15,marginBottom:20}}>Please choose a Pool Type for the Staking


</p>

</div>
</div>
{poolView === "Grid" ? (
   <>
      {renderNoPools()}

<div className="pool_list_section">
{renderInclusivePools()}

   {renderExclusivePools()}

</div>
</>
) : (
<table className="farm_table_view">
   <thead>
      <tr>
         <th>Staking</th>
         <th>Total Staked</th>
         <th>APY</th>
         <th>Total Stakers</th>
         <th>Early Unstake</th>
         <th>Locking</th>
         <th></th>
      </tr>
   </thead>
   <tbody>
      {renderListExclusivePools()}
      {renderListInclusivePools()}

     
   </tbody>
</table>
)}
<Modal
   show={chainModal}
   onHide={() =>
   {
   setChainModal(false);
   }}
   centered
   >
   <div className="modal-section p-3">
      <div className="d-flex justify-content-between" style={{ display:'flex',justifyContent:'space-between' }} >
         <div className="d-flex flex-column" style={{ display:'flex',flexDirection:'column'}} >
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
</div>
);
}