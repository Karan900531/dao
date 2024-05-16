import { stakingAddress2, tokenAddress,WETH, RPC_URL } from "./address";
import { ethers, formatEther, MaxUint256, parseEther } from "ethers";

import StakingAbi from "./abis/staking.json";
import ERC20Abi from "./abis/ERC20ABI.json";
import Native from "./abis/native.json";


const getSigner = async (address: string) => {
  const win = window as any;
  const provider = new ethers.BrowserProvider(win.ethereum);
  const signer = await provider.getSigner(address);
  return signer;
};

export const stakeToken = async (address: string, chainId: number, amount: string) => {
  const signer = await getSigner(address);


  const WETHcontract = new ethers.Contract(
    WETH[chainId as keyof typeof WETH],
    Native,
    signer
  );

  // Approve the staking contract to spend tokens with delegate and numTokens parameters
  const approveTxn = await WETHcontract.deposit({value:parseEther(amount)});

  await approveTxn.wait();

  const tokenContract = new ethers.Contract(
    tokenAddress[chainId as keyof typeof tokenAddress],
    ERC20Abi,
    signer
  );

  // Approve the staking contract to spend tokens with delegate and numTokens parameters
  const approveTx = await tokenContract.approve(
    stakingAddress2[chainId as keyof typeof stakingAddress2],
    parseEther(amount)
  );
  await approveTx.wait();

  const contract = new ethers.Contract(
    stakingAddress2[chainId as keyof typeof stakingAddress2],
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
    stakingAddress2[chainId as keyof typeof stakingAddress2],
    StakingAbi,
    signer
  );
  const tx = await contract.unstake(parseEther(amount));
  await tx.wait();


  const WETHcontract = new ethers.Contract(
    WETH[chainId as keyof typeof WETH],
    Native,
    signer
  );

  // Approve the staking contract to spend tokens with delegate and numTokens parameters
  const approveTxn = await WETHcontract.withdraw(parseEther(amount));

  await approveTxn.wait();

};

export const claimRewards = async (address: string, chainId: number) => {
  const signer = await getSigner(address);
  const contract = new ethers.Contract(
    stakingAddress2[chainId as keyof typeof stakingAddress2],
    StakingAbi,
    signer
  );

  const tx = await contract.claimRewards();
  await tx.wait();

  const WETHcontract = new ethers.Contract(
    WETH[chainId as keyof typeof WETH],
    Native,
    signer
  );
  const amount = await WETHcontract.balanceOf(address);

  // Approve the staking contract to spend tokens with delegate and numTokens parameters
  const approveTxn = await WETHcontract.withdraw(amount);
  await approveTxn.wait();


};

export const getTokenHolders = async (chainId: number) => {
  const provider = new ethers.JsonRpcProvider(RPC_URL[chainId as keyof typeof RPC_URL]);
  const contract = new ethers.Contract(
    stakingAddress2[chainId as keyof typeof stakingAddress2],
    StakingAbi,
    provider
  );

  const totalusers = await contract.getTotalUsers();

  return Number(totalusers.toString());
};

export const getTokenStaked = async (chainId: number) => {
  const provider = new ethers.JsonRpcProvider(RPC_URL[chainId as keyof typeof RPC_URL]);
  const contract = new ethers.Contract(
    stakingAddress2[chainId as keyof typeof stakingAddress2],
    StakingAbi,
    provider
  );

  const totalStaked = await contract.getTotalStaked();
  return Number(formatEther(totalStaked));
};




export const getApy = async (chainId: number) => {
  const provider = new ethers.JsonRpcProvider(RPC_URL[chainId as keyof typeof RPC_URL]);
  const contract = new ethers.Contract(
    stakingAddress2[chainId as keyof typeof stakingAddress2],
    StakingAbi,
    provider
  );

  const apy = await contract.getAPY();
  return Number(apy.toString());
};

export const getUserReward = async (address: string, chainId: number) => {
  const signer = await getSigner(address);
  const contract = new ethers.Contract(
    stakingAddress2[chainId as keyof typeof stakingAddress2],
    StakingAbi,
    signer
  );

  const reward = await contract.calculateReward(address);
  return Number(formatEther(reward));
};




export const getWithdrawableBalance = async (address: string, chainId: number) => {
  const signer = await getSigner(address);
  const contract = new ethers.Contract(
    stakingAddress2[chainId as keyof typeof stakingAddress2],
    StakingAbi,
    signer
  );

  const reward = await contract.getWithdrawableBalance(address);
  return Number(formatEther(reward));
};


export const getTimeRemainingForUnstake = async (address: string, chainId: number) => {
  const signer = await getSigner(address);
  const contract = new ethers.Contract(
    stakingAddress2[chainId as keyof typeof stakingAddress2],
    StakingAbi,
    signer
  );

  const reward = await contract.getRemainingUnstakableTime(address);
  return Number(reward);
};


export const getTimeRemainingForReward = async (address: string, chainId: number) => {
  const signer = await getSigner(address);
  const contract = new ethers.Contract(
    stakingAddress2[chainId as keyof typeof stakingAddress2],
    StakingAbi,
    signer
  );

  const reward = await contract.getTimeLeftToClaim(address);
  return Number(reward);
};



export const getStakedAmount = async (address: string, chainId: number) => {
  const signer = await getSigner(address);
  const contract = new ethers.Contract(
    stakingAddress2[chainId as keyof typeof stakingAddress2],
    StakingAbi,
    signer
  );

  
  const stakeAmount = await contract.getStakedAmount(address);
  return Number(formatEther(stakeAmount));
};


export const getEarnedReward = async (address: string, chainId: number) => {
  const signer = await getSigner(address);
  const contract = new ethers.Contract(
    stakingAddress2[chainId as keyof typeof stakingAddress2],
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
    stakingAddress2[chainId as keyof typeof stakingAddress2],
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
