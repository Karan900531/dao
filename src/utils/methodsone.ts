import { stakingAddress, tokenaddress, RPC_URL } from "./address";
import { ethers, formatEther, MaxUint256, parseEther } from "ethers";

import StakingAbi from "../utils/abis/staking.json";
import ERC20Abi from "../utils/abis/ERC20ABI.json";


const ONE_DAY_IN_SECONDS = 86400; // Number of seconds in a day



const getSigner = async (address: string) => {
  const win = window as any;
  const provider = new ethers.BrowserProvider(win.ethereum);
  const signer = await provider.getSigner(address);
  return signer;
};

export const getApy = async (chainId: number) => {
    const provider = new ethers.JsonRpcProvider(RPC_URL[chainId as keyof typeof RPC_URL]);
    const contract = new ethers.Contract(
      stakingAddress[chainId as keyof typeof stakingAddress],
      StakingAbi,
      provider
    );
  
    const apy = await contract.getPoolAPY("1");
    return Number(apy.toString());
  };
export const stakeToken = async (
  address: string,
  chainId: number,
  amount: string
) => {
  const signer = await getSigner(address);

  const tokenContract = new ethers.Contract(
    tokenaddress[chainId as keyof typeof tokenaddress],
    ERC20Abi,
    signer
  );




    const txn = await tokenContract.approve(
      stakingAddress[chainId as keyof typeof stakingAddress],
      MaxUint256
    );
    await txn.wait();


  const contract = new ethers.Contract(
    stakingAddress[chainId as keyof typeof stakingAddress],
    StakingAbi,
    signer
  );
  const tx = await contract.StakeTokens("1",parseEther(amount));
  await tx.wait();
};

export const unStakeToken = async (address: any, chainId: number,amount: string) => {
  const signer = await getSigner(address);
  const contract = new ethers.Contract(
    stakingAddress[chainId as keyof typeof stakingAddress],
    StakingAbi,
    signer
  );
  const tx = await contract.Unstake("1",parseEther(amount));
  await tx.wait();
};

export const emunStakeToken = async (address: any, chainId: number,amount: string) => {
  const signer = await getSigner(address);
  const contract = new ethers.Contract(
    stakingAddress[chainId as keyof typeof stakingAddress],
    StakingAbi,
    signer
  );
  const tx = await contract.emergencyUnstake("1");
  await tx.wait();
};


export const claimRewards = async (address: string, chainId: number) => {
  const signer = await getSigner(address);
  const contract = new ethers.Contract(
    stakingAddress[chainId as keyof typeof stakingAddress],
    StakingAbi,
    signer
  );

  const tx = await contract.claimRewards("1");
  await tx.wait();
};

export const getTokenHolders = async (chainId: number) => {
  const provider = new ethers.JsonRpcProvider(RPC_URL[chainId as keyof typeof RPC_URL]);
  const contract = new ethers.Contract(
    stakingAddress[chainId as keyof typeof stakingAddress],
    StakingAbi,
    provider
  );

  const totalusers = await 1;

  return Number(totalusers.toString());
};

export const getTokenStaked = async (chainId: number) => {
  const provider = new ethers.JsonRpcProvider(RPC_URL[chainId as keyof typeof RPC_URL]);
  const contract = new ethers.Contract(
    stakingAddress[chainId as keyof typeof stakingAddress],
    StakingAbi,
    provider
  );

  const totalStaked = await contract.getPoolStakedTokens("1");
  return Number(formatEther(totalStaked));
};

export const getTokenStakeds = async (chainId: number) => {
  const provider = new ethers.JsonRpcProvider(RPC_URL[chainId as keyof typeof RPC_URL]);
  const contract = new ethers.Contract(
    stakingAddress[chainId as keyof typeof stakingAddress],
    StakingAbi,
    provider
  );

  const totalStaked = await contract.getPoolStakedTokens("1");
  return Number(formatEther(totalStaked));
};



export const getUserReward = async (address: string, chainId: number) => {
  const signer = await getSigner(address);
  const contract = new ethers.Contract(
    stakingAddress[chainId as keyof typeof stakingAddress],
    StakingAbi,
    signer
  );

  const reward = await contract.getRewards(address,"1");
  return Number(formatEther(reward));
};


export const getClaimedReflection = async (address: string, chainId: number) => {
  const signer = await getSigner(address);
  const contract = new ethers.Contract(
    stakingAddress[chainId as keyof typeof stakingAddress],
    StakingAbi,
    signer
  );

  const reward = await contract.claimedReflection(address);
  return Number(formatEther(reward));
};



export const getUnClaimedReflection = async (address: string, chainId: number) => {
  const signer = await getSigner(address);
  const contract = new ethers.Contract(
    stakingAddress[chainId as keyof typeof stakingAddress],
    StakingAbi,
    signer
  );

  const reward = await contract.calculateRemainingReflection(address);
  return Number(formatEther(reward));
};

export const getStakedAmount = async (address: string, chainId: number) => {
  const signer = await getSigner(address);
  const contract = new ethers.Contract(
    stakingAddress[chainId as keyof typeof stakingAddress],
    StakingAbi,
    signer
  );
  const stakeAmount = await contract.getTotalStaked(address,"1");
  return Number(formatEther(stakeAmount));
};
export const getTimeLeftToClaim = async (address: string, chainId: number) => {
  const signer = await getSigner(address);
  const contract = new ethers.Contract(
    stakingAddress[chainId as keyof typeof stakingAddress],
    StakingAbi,
    signer
  );

  const lastClaimTimestamp = 1;
  const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
  const timePassedSinceLastClaim = BigInt(currentTime) - BigInt(lastClaimTimestamp);

  const ONE_DAY_IN_SECONDS = BigInt(86400);

  if (timePassedSinceLastClaim >= ONE_DAY_IN_SECONDS) {
    return BigInt(0); // User can claim rewards now
  }

  const timeLeftInSeconds =  ONE_DAY_IN_SECONDS - timePassedSinceLastClaim;
  return timeLeftInSeconds.toString();
};