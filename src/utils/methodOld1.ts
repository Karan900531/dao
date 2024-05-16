import { stakingAddressOld1, tokenAddress, RPC_URL } from "./address";
import { ethers, formatEther, MaxUint256, parseEther } from "ethers";

import StakingAbi from "./abis/oldStaking.json";
import ERC20Abi from "./abis/ERC20ABI.json";

const getSigner = async (address: string) => {
  const win = window as any;
  const provider = new ethers.BrowserProvider(win.ethereum);
  const signer = await provider.getSigner(address);
  return signer;
};

export const stakeToken = async (address: string, chainId: number, amount: string) => {
  const signer = await getSigner(address);

  const tokenContract = new ethers.Contract(
    tokenAddress[chainId as keyof typeof tokenAddress],
    ERC20Abi,
    signer
  );

  // Approve the staking contract to spend tokens with delegate and numTokens parameters
  const approveTx = await tokenContract.approve(
    stakingAddressOld1[chainId as keyof typeof stakingAddressOld1],
    parseEther(amount)
  );
  await approveTx.wait();

  const contract = new ethers.Contract(
    stakingAddressOld1[chainId as keyof typeof stakingAddressOld1],
    StakingAbi,
    signer
  );

  // Stake the tokens
  const stakeTx = await contract.stake(parseEther(amount));
  await stakeTx.wait();
};

export const unStakeToken = async (address: any, chainId: number, amount: string) => {
  const signer = await getSigner(address);
  const contract = new ethers.Contract(
    stakingAddressOld1[chainId as keyof typeof stakingAddressOld1],
    StakingAbi,
    signer
  );
  const tx = await contract.unstake(parseEther(amount));
  await tx.wait();
};

export const EarlyunStakeToken = async (address: any, chainId: number, amount: string) => {
  const signer = await getSigner(address);
  const contract = new ethers.Contract(
    stakingAddressOld1[chainId as keyof typeof stakingAddressOld1],
    StakingAbi,
    signer
  );
  const tx = await contract.earlyUnstake();
  await tx.wait();
};

export const claimRewards = async (address: string, chainId: number) => {
  const signer = await getSigner(address);
  const contract = new ethers.Contract(
    stakingAddressOld1[chainId as keyof typeof stakingAddressOld1],
    StakingAbi,
    signer
  );

  const tx = await contract.claimRewards();
  await tx.wait();
};

export const getTokenHolders = async (chainId: number) => {
  const provider = new ethers.JsonRpcProvider(RPC_URL[chainId as keyof typeof RPC_URL]);
  const contract = new ethers.Contract(
    stakingAddressOld1[chainId as keyof typeof stakingAddressOld1],
    StakingAbi,
    provider
  );

  const totalusers = await contract.getTotalUsers();

  return Number(totalusers.toString());
};

export const getTokenStaked = async (chainId: number) => {
  const provider = new ethers.JsonRpcProvider(RPC_URL[chainId as keyof typeof RPC_URL]);
  const contract = new ethers.Contract(
    stakingAddressOld1[chainId as keyof typeof stakingAddressOld1],
    StakingAbi,
    provider
  );

  const totalStaked = await contract.getTotalStaked();
  return Number(formatEther(totalStaked));
};




export const getApy = async (chainId: number) => {
  const provider = new ethers.JsonRpcProvider(RPC_URL[chainId as keyof typeof RPC_URL]);
  const contract = new ethers.Contract(
    stakingAddressOld1[chainId as keyof typeof stakingAddressOld1],
    StakingAbi,
    provider
  );

  const apy = await contract.getAPY();
  return Number(apy.toString());
};

export const getUserReward = async (address: string, chainId: number) => {
  const signer = await getSigner(address);
  const contract = new ethers.Contract(
    stakingAddressOld1[chainId as keyof typeof stakingAddressOld1],
    StakingAbi,
    signer
  );

  const reward = await contract.calculateReward(address);
  return Number(formatEther(reward));
};




export const getWithdrawableBalance = async (address: string, chainId: number) => {
  const signer = await getSigner(address);
  const contract = new ethers.Contract(
    stakingAddressOld1[chainId as keyof typeof stakingAddressOld1],
    StakingAbi,
    signer
  );

  const reward = await contract.getWithdrawableBalance(address);
  return Number(formatEther(reward));
};


export const calculateRef = async (address: string, chainId: number) => {
  const signer = await getSigner(address);
  const contract = new ethers.Contract(
    stakingAddressOld1[chainId as keyof typeof stakingAddressOld1],
    StakingAbi,
    signer
  );

  const reward = await contract.calculateDistributableBalance(address);
  return Number(formatEther(reward));
};


export const claimedRef = async (address: string, chainId: number) => {
  const signer = await getSigner(address);
  const contract = new ethers.Contract(
    stakingAddressOld1[chainId as keyof typeof stakingAddressOld1],
    StakingAbi,
    signer
  );

  const userInfo = await contract.users(address);
  
  // Assuming `earnedReward` is one of the properties in the userInfo struct
  const earnedReward = userInfo.claimedRef;
  
  return Number(formatEther(earnedReward));
};

export const getTimeRemainingForUnstake = async (address: string, chainId: number) => {
  const signer = await getSigner(address);
  const contract = new ethers.Contract(
    stakingAddressOld1[chainId as keyof typeof stakingAddressOld1],
    StakingAbi,
    signer
  );

  const reward = await contract.getRemainingUnstakableTime(address);
  return Number(reward);
};


export const getTimeRemainingForReward = async (address: string, chainId: number) => {
  const signer = await getSigner(address);
  const contract = new ethers.Contract(
    stakingAddressOld1[chainId as keyof typeof stakingAddressOld1],
    StakingAbi,
    signer
  );

  const reward = await contract.getTimeLeftToClaim(address);
  return Number(reward);
};



export const getStakedAmount = async (address: string, chainId: number) => {
  const signer = await getSigner(address);
  const contract = new ethers.Contract(
    stakingAddressOld1[chainId as keyof typeof stakingAddressOld1],
    StakingAbi,
    signer
  );

  
  const stakeAmount = await contract.getStakedAmount(address);
  return Number(formatEther(stakeAmount));
};


export const getEarnedReward = async (address: string, chainId: number) => {
  const signer = await getSigner(address);
  const contract = new ethers.Contract(
    stakingAddressOld1[chainId as keyof typeof stakingAddressOld1],
    StakingAbi,
    signer
  );
  const userInfo = await contract.users(address);
  
  // Assuming `earnedReward` is one of the properties in the userInfo struct
  const earnedReward = userInfo.earnedReward;
  
  return Number(formatEther(earnedReward));
};

export const getUserTradeHistory = async (address: string, chainId: number) => {
  const signer = await getSigner(address);
  const contract = new ethers.Contract(
    stakingAddressOld1[chainId as keyof typeof stakingAddressOld1],
    StakingAbi,
    signer
  );

  // Call the getUserTradeHistory function
  const tradeHistory = await contract.getUserTradeHistory(address);
  
  // Assuming tradeHistory is an array of tuples [actionType, amount, timestamp]
  return tradeHistory.map(([actionType, amount, timestamp]: [any, any, any]) => ({
    actionType,
    amount,
    timestamp
  }));
};
