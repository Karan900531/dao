import { ethers, formatEther, formatUnits } from "ethers";
import { erc20ABI } from "wagmi";
import { tokenaddress } from "./address";
import { tokenAddress ,RPC_URL} from "./address";


const getSigner = async (address: string) => {
  const windowEth = window as any;
  const provider = new ethers.BrowserProvider(windowEth.ethereum);
  return await provider.getSigner(address);
};

export const getBalance = async (address: string, tokenAddress: string) => {
  const signer = await getSigner(address);

  const tokenContract = new ethers.Contract(tokenAddress, erc20ABI, signer);

  const balance = await tokenContract.balanceOf(address);

  return Number(balance.toString());
};



export const getUserBalanceing = async (address: string, chainId: number) => {
  // Get the provider
  const provider = new ethers.JsonRpcProvider(RPC_URL[chainId as keyof typeof RPC_URL]);

  // Get the balance as a BigNumber
  const balanceBigNumber = await provider.getBalance(address);

  // Convert the balance to Ether
  const balanceInEther = formatEther(balanceBigNumber);

  // Return the balance as a number
  return parseFloat(balanceInEther);
};

export const getTokenInfo = async (address: string, tokenAddress: string) => {
  const signer = await getSigner(address);

  const tokenContract = new ethers.Contract(tokenAddress, erc20ABI, signer);

  const balance = await tokenContract.balanceOf(address);
  const symbol = await tokenContract.symbol();
  const decimals = await tokenContract.decimals();

  return {
    symbol,
    decimals: decimals.toString(),
    balance: Number(formatUnits(balance.toString(), decimals)),
    tokenAddress,
  };
};

export const getIsValidToken = async (address: string, tokenAddress: string) => {
  const signer = await getSigner(address);

  const tokenContract = new ethers.Contract(tokenAddress, erc20ABI, signer);

  try {
    await tokenContract.totalSupply();
    return true;
  } catch (error) {
    return false;
  }
};

export const getUserBalance = async (address: string, chainId: number) => {
  const signer = await getSigner(address);
  const contract = new ethers.Contract(
    tokenaddress[chainId as keyof typeof tokenaddress],
    erc20ABI,
    signer
  );

  const balance = await contract.balanceOf(address);
  return Number(formatEther(balance));
};