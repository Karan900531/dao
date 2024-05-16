import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Col, Row } from "react-bootstrap";
import {
  readContracts,
  useAccount,
  useChainId,
  useContractRead,
  useContractReads,
  useContractWrite,
  useWaitForTransaction,
} from "wagmi";
import ReactCountdown from "react-countdown";

import { nftStakingABI } from "../utils/abis/nftStakingABI";
import dayjs from "dayjs"
import { useTransactionStore } from "../store/transactionStore";
import { getNftsByTokenIds } from "../services/nftService";
import axios from "axios";

interface IUnstakeProps {
  stakedNfts: string[];
  nftAddress: string;
  stakingAddress: string;
}

export default function Unstake({
  stakedNfts,
  stakingAddress,
  nftAddress,
}: IUnstakeProps) {
  const chainId = useChainId();
  const { address } = useAccount();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [stakedNftsData, setStakedNftsData] = useState<
    { tokenId: string; stakeTime: number; tokenUri: string | null }[]
  >([]);
  const setTransactionStatus = useTransactionStore(
    (store) => store.setTransactionStatus
  );

  const handleGetData = useCallback(async () => {
    try {
      setLoading(true);
      const result = await Promise.all(
        stakedNfts.map(async (m) => {
          const data = await readContracts({
            contracts: [
              {
                abi: nftStakingABI,
                address: stakingAddress as any,
                functionName: "getFirstStake",
                args: [BigInt(m)],
              },
            ],
          });

          if (data[0].result) {
            return {
              tokenId: m,
              stakeTime: Number(data[0].result.toString()) * 1000,
            };
          } else {
            return undefined;
          }
        })
      );

      const filterResult = result.filter((f) => f !== undefined);

      const nfts = await getNftsByTokenIds(
        nftAddress,
        filterResult.map((m) => `${m?.tokenId}`)
      );
      console.log(nfts);

      const nftResult = filterResult.map((m) => {
        const nftData = nfts.find((f:any) => f.tokenId === m?.tokenId);
        if (nftData) {
          return { ...m, ...nftData };
        }
        return { ...m };
      });

      setStakedNftsData(nftResult as any);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [stakedNfts, nftAddress]);

  useEffect(() => {
    handleGetData();
  }, [handleGetData]);

  const {
    write,
    isLoading,
    error,
    data: writeData,
  } = useContractWrite({
    abi: nftStakingABI,
    address: stakingAddress as any,
    functionName: "unstake",
  });
  const { isSuccess } = useWaitForTransaction({ hash: writeData?.hash });

  useEffect(() => {
    if (isLoading) {
      setTransactionStatus({
        status: "PENDING",
        message: "Unstaking nft is in progress",
        title: "Unstake NFT",
      });
    }
  }, [isLoading]);

  useEffect(() => {
    if (error) {
      setTransactionStatus({
        status: "ERROR",
        message: "Something Went Wrong",
        title: "Unstake NFT",
      });
    }
  }, [error]);

  useEffect(() => {
    if (isSuccess) {
      setTransactionStatus({
        status: "SUCCESS",
        message: "NFT is unstaked successfully",
        title: "Unstake NFT",
      });

      setTimeout(() => {
        window.location.reload();
      }, 3000);
    }
  }, [isSuccess]);

  const handleUnstake = () => {
    write({ args: [selectedIds as any] });
  };

  return (
    <div>
      <div className="stake_box p-3 mt-3 text-white" style={{padding:'1rem',marginTop:'1rem'}}>
        <div>
          <div className="d-flex flex-column stake_amount_details">
            <label>$w8Bit in your wallet:</label>

            <label>
              {/* <i className="fa-solid fa-landmark-dome"></i> */}
              0.00
            </label>
          </div>

          {loading ? (
            <Row className="mt-4" style={{padding:'1.5rem 0',textAlign:'center'}}>
              <div className="text-center">Loading...</div>
            </Row>
          ) : !stakedNftsData?.length ? (
            <Row className="mt-4" style={{padding:'1.5rem 0',textAlign:'center'}}>
              <div className="text-center">No Nfts staked</div>
            </Row>
          ) : (
            <Row className="mt-4" style={{margin:'1.5rem 0'}}> 
              {stakedNftsData.map((d, i) => (
                <UnstakedCard
                  key={d.tokenId}
                  tokenId={d.tokenId}
                  stakeTime={d.stakeTime}
                  selectedIds={selectedIds}
                  setSelectedIds={setSelectedIds}
                  tokenUri={d.tokenUri}
                />
              ))}
            </Row>
          )}

          {/* <div className="d-flex flex-column  mt-3">
            <label>Unstake Amount</label>

            <div className="unstake_amount mt-3">
              <input type="text" value="0" />

              <button>Max</button>
            </div>
          </div> */}

          <div className="d-flex align-items-center justify-content-between " style={{marginBottom:'1rem'}}>
            <div className="tokens_stake_details" style={{ width: "100%" }}>
              {/* <button
                className="btn-primary"
                style={{ width: "100%" }}
                onClick={handleUnstake}
                disabled={!selectedIds.length}
              >
                <i className="fa-solid fa-landmark-dome"></i>
                {isLoading ? "Unstaking..." : "Unstake"}   
              </button> */}
            </div>
          </div>
        </div>

        {/* {poolView.viewset == false ? (
          <div className="d-flex justify-content-between mt-5">
            <div className="d-flex align-items-center">
              <label className="mx-2">Total staked:</label>

              <div className="d-flex align-items-center">
                <img src={Eightbitchain} width={30} />

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
    </div>
  );
}

interface IUnstakeCardProps {
  tokenId: string;
  stakeTime: number;
  tokenUri: string | null;
  selectedIds: string[];
  setSelectedIds: React.Dispatch<React.SetStateAction<string[]>>;
}

const UnstakedCard: React.FC<IUnstakeCardProps> = ({
  tokenId,
  stakeTime,
  setSelectedIds,
  selectedIds,
  tokenUri,
}) => {
  const [metadata, setMetadata] = useState<any>(null);

  const handleGetData = useCallback(async () => {
    try {
      if (!tokenUri) return;
      const { data } = await axios.get(tokenUri);
      console.log(data);
      setMetadata(data);
    } catch (error) {
      console.log(error);
    }
  }, [tokenUri]);

  useEffect(() => {
    handleGetData();
  }, [handleGetData]);

  return (
    <ReactCountdown
      date={dayjs(stakeTime).add(0, "days").toDate()}
      renderer={({ completed, hours, days, minutes, seconds }) => {
        if (completed) {
          return (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                border: "1px solid grey",
                borderColor: selectedIds.some((f) => f === tokenId)
                  ? "var(--primary)"
                  : "grey",
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
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <img
                  src={metadata?.image}
                  alt=""
                  style={{ width: 50, height: 50, objectFit: "cover" }}
                />
                <span style={{ fontSize: "12px" }}>
                  {metadata ? metadata?.name : tokenId}
                </span>
              </div>
              <span style={{ fontSize: "12px",marginRight:10 }}>
                {days}D : {hours}H : {minutes}M : {seconds}s
              </span>
            </div>
          );
        } else {
          return (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                border: "1px solid grey",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <img
                  src={metadata?.image}
                  alt=""
                  style={{ width: 50, height: 50, objectFit: "cover" }}
                />
                <span style={{ fontSize: "12px" }}>
                  {metadata ? metadata?.name : tokenId}
                </span>
              </div>
              <span style={{ fontSize: "12px",marginRight:10 }}>
                {days}D : {hours}H : {minutes}M : {seconds}s
              </span>
            </div>
          );
        }
      }}
    />
  );
};
