import React, { useState } from "react";
import { formatEther } from "viem";

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
import { useGetUserNfts } from "../hooks/useGetUserNfts";
import { nftStakingABI } from "../utils/abis/nftStakingABI";
import { IStakingCollection } from "../constants/types";

interface IStakingCard extends IStakingCollection {}

const StakingCardList: React.FC<IStakingCard> = ({
  name,
  countOfNft,
  image,
  nftContract,
  stakingAddress,
}) => {
  const [stakeactive, setStakeactive] = useState("stake");
  const [stakeOpen, setStakeOpen] = useState(false);

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
    functionName: "getTotalRewardEarned",
    args: [address as any],
  });

  return (
    <div className="mx-3 w-100">
      <button className="w-100 mt-5 NFT_List_btn">
        <div>
          <div className="d-flex justify-content-between align-items-center">
            <div className="NFT_imgs d-flex align-items-center">
              <img src={image} width={60} />

              <div className="d-flex flex-column mx-3">
                <label style={{ color: "#fff", fontWeight: "bold" }}>
                  {countOfNft} {name} NFT Staking Pool
                </label>
              </div>
            </div>

            <div className="d-flex justify-content-between w-25">
              <table style={{ fontSize: "14px", color: "#fff", width: "100%" }}>
                <tr>
                  <td
                    style={{
                      textDecorationLine: "underline",
                      textDecorationStyle: "dotted",
                    }}
                  >
                    Claimed Reward
                  </td>
                  <td style={{ color: "#ffba00" }}>
                    {rewardData
                      ? new Intl.NumberFormat("en-US", {
                          maximumFractionDigits: 6,
                        }).format(Number(formatEther(rewardData)))
                      : 0.0}
                  </td>
                </tr>

                <tr>
                  <td
                    style={{
                      textDecorationLine: "underline",
                      textDecorationStyle: "dotted",
                    }}
                  >
                    Eligible NFTs
                  </td>
                  <td>{data.length}</td>
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
                  <td>{stakedNfts?.length}</td>
                </tr>
              </table>
            </div>

            <div>
              <button
                style={{
                  textAlign: "center",
                  width: "100%",
                  border: "hidden",
                  borderRadius: "20px",
                  background: "#ffba00",
                  fontSize: "18px",
                  fontWeight: "500",
                  color: "#fff",
                  padding: "5px",
                }}
              >
                Harvast
              </button>
            </div>
          </div>
          <div className="stake_sections mt-3">
            <button
              onClick={() => {
                setStakeOpen(!stakeOpen);
              }}
            >
              Stake/Unstake/Details
              <i className="fa fa-caret-down"></i>
            </button>

            {stakeOpen ? (
              <div>
                <div className="d-flex align-items-center  mt-3 justify-content-center">
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
                      nftData={[]}
                      stakingAddress={stakingAddress}
                      nftAddress={nftContract}
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
            ) : null}
          </div>
        </div>
      </button>
    </div>
  );
};

export default StakingCardList;
