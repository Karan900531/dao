import React, { useState } from "react";

import rare_nft from "../Assets/rare_nft.png";

import Restake from "./Restake";
import Claim from "./Claim";
import Stake from "./stake";
import Unstake from "./Unstake";
import {
  useAccount,
  useChainId,
  useContractRead,
  useContractReads,
} from "wagmi";
import "./nft.scss"
import { useGetUserNfts } from "../hooks/useGetUserNfts";
import { nftStakingABI } from "../utils/abis/nftStakingABI";
import { formatEther } from "viem";
import { IStakingCollection } from "../constants/types";

interface IStakingCard extends IStakingCollection {}

const StakingCard: React.FC<IStakingCard> = ({
  name,
  countOfNft,
  image,
  nftContract,
  stakingAddress,
  symbol,
}) => {
  const [stakeactive, setStakeactive] = useState("stake");
  const { data } = useGetUserNfts({ collection: nftContract });
  const { address } = useAccount();

  const { data: stakedNfts } = useContractRead({
    abi: nftStakingABI,
    address: stakingAddress as any,
    functionName: "tokensOfOwner",
    args: [address as any],
  });

  const { data: rewardData } = useContractRead({
    abi: nftStakingABI,
    address: stakingAddress as any,
    functionName: "getEarnedReward",
    args: [address as any],
  });

  return (
    <div className="gogog">
      <div className="pool-box ">
        {/* <div className="pool-div1 gogol row" style={{ justifyContent: "center" }}>
        
        </div> */}

        {/* <div className='pool-head3'>Stake - 8BitChain Token</div> */}

<div style={{
  display:'flex',
  justifyContent:'space-between',
  alignItems:'center',
  padding:10,
  margin:15,
  borderBottom:'1px solid #ffba00'
}}>

<div className="pool-head2" style={{width:'60%',textAlign:'left'}}>{name} NFT Staking Pool</div>

<div style={{ width: "fit-content" }}>
            <img  src={image} width={55} style={{borderRadius:5}}/>
          </div>


</div>
        <div className="pool-table p-3">
          <table style={{ fontSize: "14px", width: "100%" }}>
            <tr>
              <td
                style={{
                  textDecorationLine: "underline",
                  textDecorationStyle: "dotted",
                }}
              >
                Claimed Reward
              </td>
              <td align="right" style={{ color: "#ffba00" }}>
                {rewardData
                  ? new Intl.NumberFormat("en-US", {
                      maximumFractionDigits: 6,
                    }).format(Number(formatEther(rewardData)))
                  : 0.0}
              </td>
              {/* <td>
                                                    <button className='btn' onClick={() => { setROIModal(true); }}>
                                                        <i className="fa fa-qrcode" style={{ color: '#fff' }} aria-hidden="true"></i>
                                                    </button>
                                                </td> */}
            </tr>

            <tr>
              {/* <td>
                <br />
              </td> */}
            </tr>

            {/* <tr>
                                        <td style={{ fontSize: '0.75rem', opacity: '0.5' }}>Eligible NFTs</td>
                                    </tr> */}
            <tr>
              <td
                style={{
                  textDecorationLine: "underline",
                  textDecorationStyle: "dotted",
                }}
              >
                Eligible NFTs
              </td>
              <td align="right">{data.length}</td>
            </tr>
            <tr>
              <td
                style={{
                  textDecorationLine: "underline",
                  textDecorationStyle: "dotted",
                }}
              >
                Staked NFTs
              </td>
              <td align="right">{stakedNfts?.length}</td>
            </tr>
            {/* <tr>
                                        <td>Start earning</td>
                                    </tr> */}
          </table>

          {/* <div style={{ width: "100%", textAlign: "center", marginTop: "50px" }}>
            <button
              style={{
                textAlign: "center",
                width: "90%",
                border: "hidden",
                borderRadius: "20px",
                background: "#ffba00",
                fontSize: "18px",
                fontWeight: "500",
                color: "#fff",
                padding: "5px",
              }}
            >
              Connect Wallet
            </button>
          </div> */}

          <div>
            <div className="" style={{marginTop:'1rem',display:'flex',alignItems:'center',justifyContent:'center'}}>
              <button
                className={
                  stakeactive == "stake"
                    ? "unstake_btn active_stake"
                    : "unstake_btn"
                }
                onClick={() => {
                  setStakeactive("stake");
                }}
              >
                Stake
              </button>
              <button
                className={
                  stakeactive == "unstake"
                    ? "unstake_btn active_stake"
                    : "unstake_btn"
                }
                onClick={() => {
                  setStakeactive("unstake");
                }}
              >
                Unstake
              </button>
              {/* <button
                className={stakeactive == "Restake" ? "unstake_btn active_stake" : "unstake_btn"}
                onClick={() => {
                  setStakeactive("restake");
                }}
              >
                Restake
              </button> */}
              <button
                className={
                  stakeactive == "claim"
                    ? "unstake_btn active_stake"
                    : "unstake_btn"
                }
                onClick={() => {
                  setStakeactive("claim");
                }}
              >
                Claim
              </button>
            </div>

            <div>
              {stakeactive == "stake" ? (
                <Stake
                  nftData={data}
                  stakingAddress={stakingAddress}
                  nftAddress={nftContract}
                  symbol={symbol}
                />
              ) : stakeactive == "unstake" ? (
                <Unstake
                  stakedNfts={
                    stakedNfts
                      ? stakedNfts.map((m) => BigInt(m).toString())
                      : []
                  }
                  stakingAddress={stakingAddress}
                  nftAddress={nftContract}
                />
              ) : stakeactive == "restake" ? (
                <Restake />
              ) : (
       
                <Claim
                  stakedNfts={
                    stakedNfts
                      ? stakedNfts.map((m) => BigInt(m).toString())
                      : []
                  }
                  stakingAddress={stakingAddress}
                  nftAddress={nftContract}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StakingCard;
