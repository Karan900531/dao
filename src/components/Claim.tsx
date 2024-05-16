import React, { useCallback, useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import {
  readContracts,
  useAccount,
  useChainId,
  useContractRead,
  useContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { nftStakingABI } from "../utils/abis/nftStakingABI";
import { formatEther } from "viem";
import { useTransactionStore } from "../store/transactionStore";
import { getNftsByTokenIds } from "../services/nftService";
import axios from "axios";

interface IClaimProps {
  stakedNfts: string[];
  stakingAddress: string;
  nftAddress: string;
}

export default function Claim({ stakedNfts, stakingAddress, nftAddress }: IClaimProps) {
  const chainId = useChainId();
  const { address } = useAccount();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [stakedNftsData, setStakedNftsData] = useState<
    { tokenId: string; reward: number; tokenUri: string | null }[]
  >([]);
  const setTransactionStatus = useTransactionStore((store) => store.setTransactionStatus);

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
                functionName: "getRewardEarnedPerNft",
                args: [BigInt(m)],
              },
            ],
          });

          if (data[0].result) {
            return {
              tokenId: m,
              reward: Number(formatEther(data[0].result)),
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

  const { data: rewardData } = useContractRead({
    abi: nftStakingABI,
    address: stakingAddress as any,
    functionName: "getTotalRewardEarned",
    args: [address as any],
  });

  const {
    write,
    isLoading,
    error,
    data: writeData,
  } = useContractWrite({
    abi: nftStakingABI,
    address: stakingAddress as any,
    functionName: "claim",
  });
  const { isSuccess } = useWaitForTransaction({ hash: writeData?.hash });

  useEffect(() => {
    if (isLoading) {
      setTransactionStatus({
        status: "PENDING",
        message: "Claim reward is in progress",
        title: "Claim Reward",
      });
    }
  }, [isLoading]);

  useEffect(() => {
    if (error) {
      setTransactionStatus({
        status: "ERROR",
        message: "Something Went Wrong",
        title: "Claim Reward",
      });
    }
  }, [error]);

  useEffect(() => {
    if (isSuccess) {
      setTransactionStatus({
        status: "SUCCESS",
        message: "Reward claimed successfully",
        title: "Claim Reward",
      });

      setTimeout(() => {
        window.location.reload();
      }, 3000);
    }
  }, [isSuccess]);

  const handleClaim = () => {
    console.log([selectedIds.map((m) => BigInt(m))]);
    write({ args: [selectedIds.map((m) => BigInt(m))] });
  };

  return (
    <div>
      <div className="stake_box p-3 mt-3 text-white" style={{padding:'1rem',marginTop:'1rem'}}>
        <div>
          <div className="d-flex flex-column stake_amount_details">
            <label>Earned Reward:</label>

            <label>
              {/* <i className="fa-solid fa-landmark-dome"></i> */}
              {rewardData
                ? new Intl.NumberFormat("en-US", { maximumFractionDigits: 6 }).format(
                    Number(formatEther(rewardData))
                  )
                : 0.0}
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
            <Row className="mt-4" style={{padding:'1.5rem 0',textAlign:'center'}}>
              {stakedNftsData.map((d) => (
                <ClaimCard
                  key={d.tokenId}
                  tokenId={d.tokenId}
                  reward={d.reward}
                  selectedIds={selectedIds}
                  setSelectedIds={setSelectedIds}
                  tokenUri={d.tokenUri}
                />
              ))}
            </Row>
          )}

          {/* <div className="d-flex flex-column  mt-3">
            <label>Claim Amount</label>

            <div className="unstake_amount mt-3">
              <input type="text" value="0" />

              <button>Max</button>
            </div>
          </div> */}

          <div className="d-flex align-items-center justify-content-between mt-3" style={{marginBottom:'1rem'}}>
            <div className="tokens_stake_details" style={{ width: "100%" }}>
              {/* <button
                className="btn-primary"
                style={{ width: "100%" }}
                onClick={handleClaim}
                disabled={!selectedIds.length}
              >
                {isLoading ? "Claiming..." : "Claim"}               </button> */}
            </div>
          </div>

          {/* <div>
            <p className="note_claim">
              Note:- in unstake section there is one typo. update w8Bit in your wallet as Your
              staked w8Bit
            </p>
          </div> */}
        </div>
      </div>
    </div>
  );
}

interface IUnstakeCardProps {
  tokenId: string;
  reward: number;
  tokenUri: string | null;
  selectedIds: string[];
  setSelectedIds: React.Dispatch<React.SetStateAction<string[]>>;
}

const ClaimCard: React.FC<IUnstakeCardProps> = ({
  tokenId,
  reward,
  setSelectedIds,
  selectedIds,
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
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        border: "1px solid grey",
        cursor: reward <= 0 ? "no-drop" : "pointer",
        borderColor: selectedIds.some((f) => f === tokenId) ? "var(--primary)" : "grey",
      }}
      onClick={() => {
        if (reward <= 0) return;
        const isExist = selectedIds.find((f) => f === tokenId);
        if (isExist) {
          setSelectedIds((s) => s.filter((f) => f !== tokenId));
        } else {
          setSelectedIds((s) => [...s, tokenId]);
        }
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
        <img src={metadata?.image} alt="" style={{ width: 50, height: 50, objectFit: "cover" }} />
        <span style={{ fontSize: "12px" }}>{metadata ? metadata?.name : tokenId}</span>
      </div>
      <span style={{ fontSize: "12px" ,marginRight:10}}>{reward}</span>
    </div>
  );
};
