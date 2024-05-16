import React, { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Chart from "react-apexcharts";
import { Bar } from 'react-chartjs-2';
import "./staking.scss"

import styled from "styled-components";
import { useWeb3Modal } from "@web3modal/react";
import {
  claimRewards,
  getApy,
  getStakedAmount,
  getTokenHolders,
  getTokenStaked,
  getUserReward,

  stakeToken,
  unStakeToken,
} from "../utils/methods";

import {

    getTokenStakeds,

  } from "../utils/methodsone";
import { useAccount, useChainId } from "wagmi";
import { getUserBalance } from "../utils/tokenContract";
import { Options, Series } from "react-apexcharts";

import "./staking.scss"


interface ChartData {
    options: ApexCharts.ApexOptions;

  }

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


const Home: React.FC = () => {
  const { open } = useWeb3Modal();
  const { address } = useAccount();
  const chain = useChainId();
  const [status, setStatus] = useState<{
    status: "PENDING" | "ERROR" | "SUCCESS";
    message: string;
  } | null>(null);
  const [amount, setAmount] = useState("");
  const [unamount, setUnAmount] = useState("");

  const [stakedAmount, setStakedAmount] = useState(0);
  const [rewardAmount, setRewardAmount] = useState(0);
  const [claimedRef, setClaimedRef] = useState(0);
  const [unclaimedRef, setUnClaimedRef] = useState(0);
  const [totalStakeds, setTotalStakeds] = useState(0);
  const [refs, setRefs] = useState(0);


    const [rewardLeft, setRewardLeft] = useState(0);

  const [balance, setBalance] = useState(0);
  const [totalStaked, setTotalStaked] = useState(0);
  const [apy, setApy] = useState(0);
  const [totalTokenHolders, setTotalTokenHolders] = useState(0);
  const [totalStakers, setTotalStakers] = useState<number>(0);

  

  const handleGetData = useCallback(async () => {
    try {
      if (!address || !chain) return;
  
      setBalance(await getUserBalance(address, chain));
  
      // Await the result of getTimeLeftToClaim and convert the BigInt to a number

  
      setStakedAmount(await getStakedAmount(address, chain));
      setRewardAmount(await getUserReward(address, chain));


    } catch (error) {
      console.log(error);
    }
  }, [address, chain]);
  
  const handleGetContractData = useCallback(async () => {
    try {
      setTotalTokenHolders(await getTokenHolders(chain));
      setTotalStaked(await getTokenStaked(chain));
      setTotalStakeds(await getTokenStakeds(chain));
   

      setApy(await getApy(chain));
    } catch (error) {
      console.log(error);
    }
  }, [chain]);

  useEffect(() => {
    handleGetData();
    handleGetContractData();
  }, [handleGetData, handleGetContractData]);

  const TopDiv = styled.div`
    width: 100%;
    height: auto;

    padding-top: 30px;
    display: flex;
    padding-bottom: 30px;
    justify-content: center;
    align-items: center;
    .blockhead {
      width: 70%;
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      column-gap: 30px;
    }

    .blocktop {
      background-color: var(--background);
      padding: 20px 30px;
      border-radius: 10px;
      box-shadow: 0px 0px 10px #ffba00;

      p {
        font-size: 14px;
      }

      h2 {
        font-weight: 500;
      }
    }

    @media (max-width: 767px) {
      width: 100%;
      height: auto;

      padding-top: 30px;
      display: flex;
      padding-bottom: 30px;
      justify-content: center;
      align-items: center;
      .blockhead {
        width: 95%;
        display: grid;
        grid-template-columns: 1fr;
        row-gap: 30px;
      }

      .blocktop {
        background-color: var(--background);
        padding: 20px 30px;
        border-radius: 10px;
        box-shadow: 0px 0px 10px #ffba00;

        p {
          font-size: 14px;
        }

        h2 {
          font-weight: 500;
        }
      }
    }
  `;

  const MainDiv = styled.div`
    width: 100%;
    height: auto;

    padding-top: 0px;
    display: flex;
    padding-bottom: 30px;
    justify-content: center;
    align-items: center;
  `;

  const Explore = styled.div`
    width: 100%;
    height: auto;
    padding-top: 0;
    padding-bottom: 50px;
    display: flex;
    align-items: center;
    justify-content: center;

    h2 {
      font-weight: 500;
      text-align: center;
      font-size: 26px;
    }

    .divisions {
      width: 70%;
      display: grid;
      grid-template-columns: 1fr 1fr;
      column-gap: 30px;

      .stakeblock {
        background-color: var(--background);
        padding: 20px 30px;
        border-radius: 10px;
        box-shadow: 0px 0px 10px #ffba00;

        p {
          font-size: 14px;
        }

        .web3-btn {
          display: flex;
          justify-content: center;
          button {
            border: 1px solid #fff;
            outline: none;
            background: #ffba00;
            font-family: var(--font-medium);
            border-radius: 12px;
            padding: 12px 14px;
            color: var(--white);
            width: 100%;
            margin: 30px 0;
            cursor: pointer;
          }
        }

        h2 {
          text-align: left;
          font-size: 25px;
          margin-top: 20px;
          font-weight: 500;
        }
      }
    }

    @media (max-width: 767px) {
      .divisions {
        width: 98%;

        grid-template-columns: 1fr;
        row-gap: 30px;
      }
    }
  `;

  const InnerDiv = styled.div`
    width: 70%;
    height: auto;
    padding: 30px 0;
    border-radius: 10px;
    box-shadow: 0px 0px 10px #ffba00;

    background-color: var(--background);
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
      width: 70%;
      grid-template-columns: 1fr;
      column-gap: 10px;
      padding: 0 20px 0 20px;
    }

    .divthreemain {
      display: flex;
      justify-content: center;
      align-items: center;
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
            border: 1px solid #fff;
        outline: none;
        background: #ffba00;
        font-family: var(--font-medium);
        border-radius: 12px;
        padding: 12px 14px;
        color: var(--white);
        width: 100%;
        margin: 30px 170px;
        cursor: pointer;
      }
    }

    @media (max-width: 767px) {
      width: 98%;

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
            border: 1px solid #fff;
          outline: none;
          background: #ffba00;
          font-family: var(--font-medium);
          border-radius: 12px;
          padding: 12px 14px;
          color: var(--white);
          width: 100%;
          margin: 30px 20px;
          cursor: pointer;
        }
      }
    }
  `;

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

      await stakeToken(address, chain, amount);
    } catch (error) {
      console.log(error);
    } finally {
    }
  };

  const handleUnstake = async () => {
    try {
      if (!address) return alert("connect wallet");
      await unStakeToken(address, chain,unamount);
    } catch (error) {
      console.log(error);
    } finally {
    }
  };



  const [pairData, setPairData] = useState<PairData | null>(null);


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

  const [chartOptions, setChartOptions] = useState<any>({
    chart: {
      id: "area-chart",
      toolbar: {
        show: false
      }
    },
    xaxis: {
      categories: ['Special BSC Pool', 'NFT Holders 2X Pool'],
      labels: {
        show: false // Hide X-axis labels
      },
      axisBorder: {
        show: false // Hide X-axis border lines
      },
      crosshairs: {
        show: false,
      },
      axisTicks: {
        show: false,
      },

    },
    yaxis: {
      labels: {
        show: false // Hide Y-axis labels
      },
      axisBorder: {
        show: false // Hide Y-axis border lines
      }
    },
    grid: {
      show: false // Hide grid lines
    },
    stroke: {
      curve: 'smooth' // Smooth curve for area chart
    },
    dataLabels: {
      enabled: false // Hide data point labels
    },
    tooltip: {
      theme: 'dark', // Set tooltip theme to dark
      custom: function({ series, seriesIndex, dataPointIndex, w }: { series: any, seriesIndex: number, dataPointIndex: number, w: any }) {
        return '<div class="custom-tooltip">' +
          '<span>' + series[seriesIndex][dataPointIndex] + ' w8Bit</span>' +
          '</div>'
      }
    },
    colors: ['#ffba00'],
    series: [{
        data: ["/* your data points here */"],
        markers: {
          size: 0 // Set the size of markers to 0 to hide them
        }
      }]
  });
  


  const [chartSeries, setChartSeries] = useState<any>([]);

  useEffect(() => {
    // Fetch data and set chart series
    const totalStakedPool1 = totalStaked;
    const totalStakedPool2 = totalStakeds;
    setChartSeries([{ data: [totalStakedPool1, totalStakedPool2] }]);
  }, [totalStaked, totalStakeds]);


  const handleClaim = async () => {
    try {
      if (!address) return alert("connect wallet");

    
      await claimRewards(address, chain);
    } catch (error) {
      console.log(error);
    } finally {
    }
  };

  return (
    <div className="pad">
        <div className="chartops">
         {pairData && (
            <>
 <p style={{fontSize:14}}>Total w8Bit Staked</p>
  <p style={{textAlign:'left',fontSize:22,color:'white',fontFamily:'var(--font-medium)',marginTop:15}}>{new Intl.NumberFormat("en-US", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 4,
              }).format(Number((totalStakeds + totalStaked)))}{" "} w8Bit
              </p>

              {/* <p>Total Staked</p>
  <p style={{textAlign:'right'}}> {new Intl.NumberFormat("en-US", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }).format(Number(totalStaked*pairData.priceUsd))}{" "}
              w8Bit</p>

     <p>Total Staked</p>
  <p style={{textAlign:'right'}}> {new Intl.NumberFormat("en-US", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }).format(Number(totalStakeds*pairData.priceUsd))}{" "}
              w8Bit</p> */}
</>
   
         )}


      </div>

      <div className="chartops" style={{marginTop:30}}>
         {pairData && (
            <>
 <p style={{fontSize:14}}>Total w8Bit Stakers</p>
  <p style={{textAlign:'left',fontSize:22,color:'white',fontFamily:'var(--font-medium)',marginTop:15}}>
  {totalStakers} </p>

              {/* <p>Total Staked</p>
  <p style={{textAlign:'right'}}> {new Intl.NumberFormat("en-US", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }).format(Number(totalStaked*pairData.priceUsd))}{" "}
              w8Bit</p>

     <p>Total Staked</p>
  <p style={{textAlign:'right'}}> {new Intl.NumberFormat("en-US", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }).format(Number(totalStakeds*pairData.priceUsd))}{" "}
              w8Bit</p> */}
</>
   
         )}


      </div>

      <div className="chartops" style={{marginTop:30}}>
         {pairData && (
            <>
 <p style={{fontSize:14}}>Distributed w8Bit Reflection</p>
  <p style={{textAlign:'left',fontSize:22,color:'white',fontFamily:'var(--font-medium)',marginTop:15}}>{new Intl.NumberFormat("en-US", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 4,
              }).format(Number((refs)))}{" "} w8Bit
              </p>

              {/* <p>Total Staked</p>
  <p style={{textAlign:'right'}}> {new Intl.NumberFormat("en-US", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }).format(Number(totalStaked*pairData.priceUsd))}{" "}
              w8Bit</p>

     <p>Total Staked</p>
  <p style={{textAlign:'right'}}> {new Intl.NumberFormat("en-US", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }).format(Number(totalStakeds*pairData.priceUsd))}{" "}
              w8Bit</p> */}
</>
   
         )}


      </div>
    </div>
  );
};

export default Home;
