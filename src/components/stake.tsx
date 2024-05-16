import React, { useCallback, useEffect, useState } from "react";
import RangeSlider from "react-range-slider-input";
import "react-range-slider-input/dist/style.css";
import { Link } from "react-router-dom";
import { Col, Row } from "react-bootstrap";

import { INft } from "../constants/types";
import {
  useAccount,
  useChainId,
  useContractRead,
  useContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { nftStakingABI } from "../utils/abis/nftStakingABI";
import { NFT_ADDRESS } from "../utils/address";
import { nftABI } from "../utils/abis/nftABI";
import { useWeb3Modal } from "@web3modal/react";
import { formatEther } from "viem";
import { useTransactionStore } from "../store/transactionStore";
import axios from "axios";

interface IStakeProps {
  nftData: INft[];
  stakingAddress: string;
  nftAddress: string;
  symbol?: string;
}

export default function Stake({
  nftData,
  stakingAddress,
  nftAddress,
  symbol,
}: IStakeProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const chainId = useChainId();
  const { address } = useAccount();
  const { open } = useWeb3Modal();
  const setTransactionStatus = useTransactionStore(
    (store) => store.setTransactionStatus
  );

  const { data, refetch } = useContractRead({
    abi: nftABI,
    address: nftAddress as any,
    functionName: "isApprovedForAll",
    args: [address as any, stakingAddress as any],
  });

  const { data: perNftRewardData } = useContractRead({
    abi: nftStakingABI,
    address: stakingAddress as any,
    functionName: "perNftReward",
  });

  const {
    write,
    isLoading,
    error,
    data: writeData,
  } = useContractWrite({
    abi: nftStakingABI,
    address: stakingAddress as any,
    functionName: "stake",
  });
  const { isSuccess } = useWaitForTransaction({ hash: writeData?.hash });
  const {
    write: approve,
    isLoading: approveLoading,
    error: approveError,
    data: approveData,
  } = useContractWrite({
    abi: nftABI,
    address: nftAddress as any,
    functionName: "setApprovalForAll",
    args: [stakingAddress as any, true],
  });
  const { isSuccess: approveSuccess } = useWaitForTransaction({
    hash: approveData?.hash,
  });

  useEffect(() => {
    if (approveSuccess) {
      setTransactionStatus({
        status: "SUCCESS",
        message: "NFT is approved successfully",
        title: "Approve NFT",
      });

      setTimeout(() => {
        refetch();
      }, 3000);
    }
  }, [approveSuccess]);

  useEffect(() => {
    if (isSuccess) {
      setTransactionStatus({
        status: "SUCCESS",
        message: "Your NFT is staked successfully",
        title: "Stake NFT",
      });

      setTimeout(() => {
        window.location.reload();
      }, 3000);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isLoading) {
      setTransactionStatus({
        status: "PENDING",
        message: "Your NFT is being staked",
        title: "Stake NFT",
      });
    }
  }, [isLoading]);

  useEffect(() => {
    if (approveError) {
      setTransactionStatus({
        status: "ERROR",
        message: "Something Went Wrong",
        title: "Approve NFT",
      });
    }
  }, [approveError]);

  useEffect(() => {
    if (error) {
      setTransactionStatus({
        status: "ERROR",
        message: "Something Went Wrong",
        title: "Stake NFT",
      });
    }
  }, [error]);

  useEffect(() => {
    if (approveLoading) {
      setTransactionStatus({
        status: "PENDING",
        message: "Your NFT is approving",
        title: "Approve NFT",
      });
    }
  }, [approveLoading]);

  const handleSubmit = () => {
    write({ args: [[...selectedIds.map((m) => BigInt(m))] as any] });
  };

  const handleApprove = () => {
    approve();
  };

  const perNftReward = perNftRewardData
    ? Number(formatEther(perNftRewardData))
    : 0;

  return (
    <div className="stake_box   text-white" style={{padding:'1rem',marginTop:'1rem'}}>
      <div className="d-flex">
        <div className=" stake_amount_details">
          <label>${symbol} in your wallet:</label>

          {/* <label>
            <i className="fa-solid fa-wallet"></i>
            0.00
          </label> */}
        </div>
      </div>

      {!nftData.length ? (
        <Row className=" text-center" style={{padding:'1.5rem 0',textAlign:'center'}}>
          <div>No NFTs </div>
        </Row>
      ) : (
        <div className="nft-grid-wrapper" style={{marginTop:'1rem'}}>
          {nftData.map((d) => (
            <NftCard
              key={d.tokenId}
              {...d}
              selectedIds={selectedIds}
              setSelectedIds={setSelectedIds}
            />
          ))}
        </div>
      )}

      {/* <div className="mt-3">
        <div className="d-flex flex-column  mt-3">
          <label>stake Amount</label>

          <div className="unstake_amount mt-3">
            <input type="text" value="0" />

            <button>Max</button>
          </div>
        </div>
      </div> */}

      <div
        className="d-flex  align-items-center justify-content-between "
        style={{ flexDirection: "column", gap: 10 }}
      >
        <div className="tokens_stake_details" style={{textAlign:'center',marginTop:'1rem'}}>
          <label>
            Tokens :&nbsp;
            {new Intl.NumberFormat("en-US", {
              maximumFractionDigits: 15,
            }).format(selectedIds.length * perNftReward * 10 ** 18)}{" "}
            w8Bit
          </label>
        </div>

        <div className="tokens_stake_details">
          {!address ? (
            <button onClick={() => open()} style={{marginBottom:'1rem'}}>
              Connect
            </button>
          ) : data ? (
            <button
              className="btn-primary"
              onClick={handleSubmit}
              style={{marginBottom:'1rem',fontSize:15}}
              // disabled={!selectedIds.length}
            >
              {/* <i className="fa-solid fa-landmark-dome"></i> */}
              {isLoading ? "Staking..." : "Stake"}            </button>
          ) : (
            <button disabled={approveLoading} onClick={handleApprove} style={{width:'100%',margin:'1rem 0'}}>
              {/* <i className="fa-solid fa-landmark-dome"></i> */}
              {approveLoading ? "Approving..." : "Approve"}
            </button>
          )}
        </div>
      </div>

      {/* {poolView.viewset === false ? (
        <div className="d-flex justify-content-between mt-5">
          <div className="d-flex align-items-center">
            <label className="mx-2">Total staked:</label>

            <div className="d-flex align-items-center">
              <img src={Eightbitchain} width={30} alt="currency" />

              <label style={{ textAlign: "left", marginLeft: "10px", color: "#fff" }}>
                8BitChain: 0.00
                <br />
                USD: $0.00
              </label>
            </div>
          </div>

          <div className="stake_footer">
            <label>
              <Link to="/">
                See token info <i className="fa fa-external-link" aria-hidden="true"></i>
              </Link>
            </label>

            <label>
              <Link to="/">
                View project info <i className="fa fa-external-link" aria-hidden="true"></i>
              </Link>
            </label>

            <label>
              <Link to="/">
                View contract <i className="fa fa-external-link" aria-hidden="true"></i>
              </Link>
            </label>
          </div>
        </div>
      ) : null} */}
    </div>
  );
}

interface INftCard extends INft {
  selectedIds: string[];
  setSelectedIds: React.Dispatch<React.SetStateAction<string[]>>;
}

const NftCard: React.FC<INftCard> = ({
  selectedIds,
  setSelectedIds,
  tokenId,
  tokenUri,
}) => {
  const [metadata, setMetadata] = useState<any>(null);

  const handleGetData = useCallback(async () => {
    try {
      if (!tokenUri) return;
      const { data } = await axios.get(tokenUri);
      setMetadata(data);
    } catch (error) {
      console.log(error);
    }
  }, [tokenUri]);

  useEffect(() => {
    handleGetData();
  }, [handleGetData]);

  return (
    <div
      style={{
        textAlign: "center",
        border: "1px solid grey",
        borderColor: selectedIds.some((f) => f === tokenId)
          ? "var(--primary)"
          : "grey",
        padding: 5,
      }}
      onClick={() => {
        const isExist = selectedIds.find((f) => f === tokenId);
        if (isExist) {
          setSelectedIds((s) => s.filter((f) => f !== tokenId));
        } else {
          setSelectedIds((s) => [...s, tokenId]);
        }
      }}
    >
      <div style={{ width: "50px", height: "50px", margin: "0 auto" }}>
        <img
          src={metadata?.image}
          alt=""
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
      <p style={{ fontSize: "10px", marginTop: 5, marginBottom: 0 }}>
        {" "}
        {metadata?.name}
      </p>
    </div>
  );
};
