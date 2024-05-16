import { WETH } from "./address";
import { ethers, formatEther, formatUnits,parseEther } from "ethers";

import ERC20Abi from "../utils/abis/native.json";
import { erc20ABI } from "wagmi";

const getSigner = async (address: string) => {
  const win = window as any;
  const provider = new ethers.BrowserProvider(win.ethereum);
  const signer = await provider.getSigner(address);
  return signer;
};

export const stakeToken = async (address: string, chainId: number, amount: string) => {
    const signer = await getSigner(address);
  

  
    const contract = new ethers.Contract(
      WETH[chainId as keyof typeof WETH],
      ERC20Abi,
      signer
    );
  
    // Stake the tokens
    const stakeTx = await contract.deposit({value:parseEther(amount)});
    await stakeTx.wait();
  };

export const getTokenInfo = async (address: string, WETH: string) => {
  const signer = await getSigner(address);

  const tokenContract = new ethers.Contract(WETH, erc20ABI, signer);

  const balance = await tokenContract.balanceOf(address);
  const symbol = await tokenContract.symbol();
  const decimals = await tokenContract.decimals();

  return {
    symbol,
    decimals: decimals.toString(),
    balance: Number(formatUnits(balance.toString(), decimals)),
    WETH,
  };
};


export const getBalance = async (address: string, chainId: number) => {
  const signer = await getSigner(address);
  const contract = new ethers.Contract(
    WETH[chainId as keyof typeof WETH],
    ERC20Abi,
    signer
  );

  const reward = await contract.getReward(address);
  return Number(formatEther(reward));
};


export const getIsValidToken = async (address: string, WETH: string) => {
  const signer = await getSigner(address);

  const tokenContract = new ethers.Contract(WETH, erc20ABI, signer);

  try {
    await tokenContract.totalSupply();
    return true;
  } catch (error) {
    return false;
  }
};
