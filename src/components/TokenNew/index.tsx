import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useAccount, useBalance, useChainId } from "wagmi";
import { useDebounce } from "usehooks-ts";
import { ethers, formatUnits  } from "ethers";
import { MaxUint256,  formatEther, parseEther, Wallet  } from "ethers";

import "../Swap.scss";
import NewLogo from "../../assets/images/LogoImg.png"
// import Logo from "../../assets/icons/download.png";
// import patrickLogo from "../../assets/images/patrick-logo.png";
// import etherLogo from "../../assets/icons/ether.png";

// import { ReactComponent as BNBIcon } from "../../assets/icons/bnb.svg";

import { getTokenInfo,getUserBalance } from "../../utils/tokenContract";

import { getTotalPoolClaimed,unclaimedPool,claimedPool,claimToken } from "../../utils/dist";

import { getAmountsOut, swap, swapExactEthToken } from "../../utils/swap";
import { DEFAULT_TO_TOKEN, WETH_TOKEN } from "../../utils/address";
import { useWeb3Modal } from "@web3modal/react";

const Swap: React.FC = () => {
  const [settingsModal, setSettingsModal] = useState(false);
  const chainId = useChainId();
  const { address } = useAccount();
  const [fromInput, setFromInput] = useState("");
  const [slippage, setSlippage] = useState("");
  const [toInput, setToInput] = useState("");
  const debouncedValue = useDebounce<string>(fromInput, 500);
  const [loading, setLoading] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [claiming2, setClaiming2] = useState(false);
  const [claiming3, setClaiming3] = useState(false);

  const [balance, setBalance] = useState(0);
  const [balanceClaimZero, setBalanceZero] = useState(0);
  const [balanceUnclaimZero, setUBalanceZero] = useState(0);
  const [balancelaimZero, setCBalanceZero] = useState(0);
  const [balanceClaimZero2, setBalanceZero2] = useState(0);
  const [balanceUnclaimZero2, setUBalanceZero2] = useState(0);
  const [balancelaimZero2, setCBalanceZero2] = useState(0);
  const [balanceClaimZero3, setBalanceZero3] = useState(0);
  const [balanceUnclaimZero3, setUBalanceZero3] = useState(0);
  const [balancelaimZero3, setCBalanceZero3] = useState(0);

  const [fromTokenModal, setFromTokenModal] = useState(false);
  const [toTokenModal, setToTokenModal] = useState(false);
  const { open } = useWeb3Modal();

  const [selectedToList, setSelectedToList] = useState<{
    symbol: any;
    decimals: any;
    balance: number;
    tokenAddress: string;
  } | null>(null);
  const [selectedFromList, setSelectedFromList] = useState<{
    symbol: any;
    decimals: any;
    balance: number;
    tokenAddress: string;
  } | null>(null);
  const { data } = useBalance({
    address: address,
  });


  
  
  const handleGetData = useCallback(async () => {
    try {
      if (!address || !chainId) return;
  
      setBalance(await getUserBalance(address, chainId));
      setBalanceZero(await getTotalPoolClaimed("0",address, chainId,"0xa8c1Bc64418ba2856D8B50471AD9eDa8D3000882"));
      setUBalanceZero(await unclaimedPool("0",address, chainId,"0xa8c1Bc64418ba2856D8B50471AD9eDa8D3000882"));
      setCBalanceZero(await claimedPool("0",address, chainId,"0xa8c1Bc64418ba2856D8B50471AD9eDa8D3000882"));
      setBalanceZero2(await getTotalPoolClaimed("0",address, chainId,"0x85657eAFC1666655332aC850D99371111EBAa1f9"));
      setUBalanceZero2(await unclaimedPool("0",address, chainId,"0x85657eAFC1666655332aC850D99371111EBAa1f9"));
      setCBalanceZero2(await claimedPool("0",address, chainId,"0x85657eAFC1666655332aC850D99371111EBAa1f9"));
      setBalanceZero3(await getTotalPoolClaimed("0",address, chainId,"0x37A32CDB46bE53f03cB0b1e7369E381773750acc"));
      setUBalanceZero3(await unclaimedPool("0",address, chainId,"0x37A32CDB46bE53f03cB0b1e7369E381773750acc"));
      setCBalanceZero3(await claimedPool("0",address, chainId,"0x37A32CDB46bE53f03cB0b1e7369E381773750acc"));
      
      
      // Await the result of getTimeLeftToClaim and convert the BigInt to a number
   
    } catch (error) {
      console.log(error);
    }
  }, [address, chainId]);

  const handleGetUserBalance = useCallback(async () => {
    if (address) {
      try {
        // const fromToken = await getTokenInfo(
        //   address,
        //   DEFAULT_FROM_TOKEN[chainId as keyof typeof DEFAULT_FROM_TOKEN]
        // );

        const toToken = await getTokenInfo(
          address,
          DEFAULT_TO_TOKEN[chainId as keyof typeof DEFAULT_TO_TOKEN]
        );

        setSelectedFromList({
          balance: 0,
          decimals: 18,
          symbol: "8BIT",
          tokenAddress: WETH_TOKEN[chainId as keyof typeof WETH_TOKEN],
        });
        setSelectedToList(toToken);
      } catch (error) {
        console.log(error);
      }
    }
  }, [address, chainId]);

  useEffect(() => {
    handleGetData();

    handleGetUserBalance();
  }, [    handleGetData,
    handleGetUserBalance]);
  

 


  
  const handleClaimZero = async () => {
    try {
      if (!address) return alert("Connect wallet");

      setClaiming(true);


      // Create a new Wallet object with a valid provider
      const windowEth = window as any;
      const provider = new ethers.BrowserProvider(windowEth.ethereum);

      // Simulate the swapping operation (replace this with your actual swapping logic)
      await claimToken(
        address,
        chainId,
        "0",
        "0x786b794059bB18D6129D07f371f550f5e9524E5A"
      );

      alert("Claimed successfully");
    } catch (error) {
      console.log(error);
      alert(error);
    } finally {
      setClaiming(false);
    }
  };


  
  const handleClaimZero2 = async () => {
    try {
      if (!address) return alert("Connect wallet");

      setClaiming2(true);


      // Create a new Wallet object with a valid provider
      const windowEth = window as any;
      const provider = new ethers.BrowserProvider(windowEth.ethereum);

      // Simulate the swapping operation (replace this with your actual swapping logic)
      await claimToken(
        address,
        chainId,
        "0",
        "0x85657eAFC1666655332aC850D99371111EBAa1f9"
      );

      alert("Claimed successfully");
    } catch (error) {
      console.log(error);
      alert(error);
    } finally {
      setClaiming2(false);
    }
  };

  
  
  const handleClaimZero3 = async () => {
    try {
      if (!address) return alert("Connect wallet");

      setClaiming3(true);


      // Create a new Wallet object with a valid provider
      const windowEth = window as any;
      const provider = new ethers.BrowserProvider(windowEth.ethereum);

      // Simulate the swapping operation (replace this with your actual swapping logic)
      await claimToken(
        address,
        chainId,
        "0",
        "0x37A32CDB46bE53f03cB0b1e7369E381773750acc"
      );

      alert("Claimed successfully");
    } catch (error) {
      console.log(error);
      alert(error);
    } finally {
      setClaiming3(false);
    }
  };

  
  
 




  return (
    <div className="pad">
  


      <h2 className="dashboard-heading" style={{marginTop:20}}>Token Distribution
</h2>
<div>
     
<p style={{fontSize:15,marginBottom:20}}>Token Distribution is used to reward our true supporters


</p>

</div>
        <div className="token-dist-grid">

   
        
           <div className="tokencol">
<h3>Claim HODL Heist Rewards
</h3>

<div  className="totalclaimed">
<p style={{color:'fff'}}>Number of Tokens Claimed

:</p>
<div className="newflextoken">
  ~ {balanceClaimZero2.toString()} w8Bit
</div>
</div>
<p style={{color:'fff'}}>w8Bit Holdings :</p>
<div className="newflextoken">
  <img src={NewLogo} className="NewLogo" />  {balance.toString()} w8Bit
</div>


<p style={{color:'fff'}}>Total w8Bit claimed:

:</p>
<div className="newflextoken">
  <img src={NewLogo} className="NewLogo" /> {balancelaimZero2.toString()} w8Bit
</div>


<p style={{color:'fff'}}>Unclaimed w8Bit :</p>
<div className="newflextoken">
  <img src={NewLogo} className="NewLogo" />  {balanceUnclaimZero2.toString()} w8Bit
</div>

<button
            className="btn-primary"
            onClick={() => (address ? handleClaimZero2() : open())}
            disabled={claiming2}
          >
            {!address ? "Connect wallet" : claiming2 ? "Please Wait..." : "Claim Now"}
          </button>
           </div>

           <div className="tokencol">
<h3>Claim Quarterly Dividend 
</h3>

<div  className="totalclaimed">
<p style={{color:'fff'}}>Number of Tokens Claimed

:</p>
<div className="newflextoken">
  ~ {balanceClaimZero3.toString()} w8Bit
</div>
</div>
<p style={{color:'fff'}}>w8Bit Holdings :</p>
<div className="newflextoken">
  <img src={NewLogo} className="NewLogo" />  {balance.toString()} w8Bit
</div>


<p style={{color:'fff'}}>Total w8Bit claimed:

:</p>
<div className="newflextoken">
  <img src={NewLogo} className="NewLogo" /> {balancelaimZero3.toString()} w8Bit
</div>


<p style={{color:'fff'}}>Unclaimed w8Bit :</p>
<div className="newflextoken">
  <img src={NewLogo} className="NewLogo" />  {balanceUnclaimZero3.toString()} w8Bit
</div>

<button
            className="btn-primary"
            onClick={() => (address ? handleClaimZero3() : open())}
            disabled={claiming3}
          >
            {!address ? "Connect wallet" : claiming3 ? "Please Wait..." : "Claim Now"}
          </button>
           </div>

           <div className="tokencol">
<h3>Claim Vested w8Bit Token</h3>

<div  className="totalclaimed">
<p style={{color:'fff'}}>Number of Tokens Claimed

:</p>
<div className="newflextoken">
  ~ {balanceClaimZero.toString()} w8Bit
</div>
</div>
<p style={{color:'fff'}}>w8Bit Holdings :</p>
<div className="newflextoken">
  <img src={NewLogo} className="NewLogo" />  {balance.toString()} w8Bit
</div>


<p style={{color:'fff'}}>Total w8Bit claimed:

:</p>
<div className="newflextoken">
  <img src={NewLogo} className="NewLogo" /> {balancelaimZero.toString()} w8Bit
</div>


<p style={{color:'fff'}}>Unclaimed w8Bit :</p>
<div className="newflextoken">
  <img src={NewLogo} className="NewLogo" />  {balanceUnclaimZero.toString()} w8Bit
</div>

<button
            className="btn-primary"
            onClick={() => (address ? handleClaimZero() : open())}
            disabled={claiming}
          >
            {!address ? "Connect wallet" : claiming ? "Please Wait..." : "Claim Now"}
          </button>
           </div>


        </div>


        

     

    </div>
  );
};

export default Swap;
