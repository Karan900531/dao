import { MaxUint256, ethers, formatEther, parseEther } from "ethers";
import nftAbi from "./abis/nftAbi.json";

import { NFTS } from "./address";


export const getSigner = async (address: any) => {
    const windowEth = window as any;
    const provider = new ethers.BrowserProvider(windowEth.ethereum);
    return await provider.getSigner(address);
  };


  export const fetchNFTHoldingsForAddress = async (provider: any, address: string, nftContracts: string[]) => {
    const holdings: Record<string, string> = {};

    for (const nftContractAddress of nftContracts) {
        const contract = new ethers.Contract(nftContractAddress, nftAbi, provider);
        const balance = await contract.balanceOf(address);
        holdings[nftContractAddress] = balance.toString();
    }

    return holdings;
};
