import { ethers, formatEther, formatUnits } from "ethers";

import ERC20Abi from "../utils/abis/dist.json";
import { erc20ABI } from "wagmi";

const getSigner = async (address: string) => {
  const win = window as any;
  const provider = new ethers.BrowserProvider(win.ethereum);
  const signer = await provider.getSigner(address);
  return signer;
};

export const getTotalPoolClaimed = async (pool: string,address: string, chainId: number,tokendist:string) => {
  const signer = await getSigner(address);
  const contract = new ethers.Contract(
    tokendist,
    ERC20Abi,
    signer
  );

  const balance = await contract.totalPoolClaimed(pool,"0xbc6378faae98fb2207bb6c35c0f8ce5846fd4c6c");
  return Number(formatEther(balance));
};


export const unclaimedPool = async (pool: string,address: string, chainId: number,tokendist:string) => {
  const signer = await getSigner(address);
  const contract = new ethers.Contract(
    tokendist,
      ERC20Abi,
      signer
    );
  
    const balance = await contract.unClaimed(address,pool);
    return Number(formatEther(balance));
  };

  export const claimedPool = async (pool: string,address: string, chainId: number,tokendist:string) => {
    const signer = await getSigner(address);
    const contract = new ethers.Contract(
      tokendist,
      ERC20Abi,
      signer
    );
  
    const balance = await contract.Claimed(address,pool);
    return Number(formatEther(balance));
  };
  

  
export const claimToken = async (address: any, chainId: number,pool: string,tokendist:string) => {
    const signer = await getSigner(address);
    const contract = new ethers.Contract(
        tokendist,
        ERC20Abi,
      signer
    );
    const tx = await contract.claim(pool);
    await tx.wait();
  };
  
  
