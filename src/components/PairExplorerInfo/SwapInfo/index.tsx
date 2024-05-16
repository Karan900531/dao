import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useAccount, useBalance, useChainId } from "wagmi";
import { useDebounce } from "usehooks-ts";
import { ethers, formatUnits, parseEther } from "ethers";
import { ReactComponent as CycleIcon } from "../../../assets/icons/rotate.svg";
import axios from "axios";
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue } from 'firebase/database';
import "./SwapInfo.scss";
// import Logo from "../../assets/icons/download.png";
// import patrickLogo from "../../assets/images/patrick-logo.png";
// import etherLogo from "../../assets/icons/ether.png";

// import { ReactComponent as BNBIcon } from "../../assets/icons/bnb.svg";
import LayoutModule from "./Modal";
import SelectToken from "./SelectToken";
import Modal from "./Modal/Modal";
import { getTokenInfo } from "../../../utils/tokenContract";
import { getAmountsOut, swap, swapExactEthToken } from "../../../utils/swap";
import { DEFAULT_TO_TOKEN, WETH_TOKEN } from "../../../utils/address";
import { useWeb3Modal } from "@web3modal/react";



interface PairData {
  pairAddress: string;

  baseToken: {
    symbol: string;
  };
  quoteToken: {
    symbol: string;
  };
  priceUsd: number;
  priceNative: number;

  volume: {
    h24: number;
  };
  priceChange: {
    h24: number;
  };
  // Add other properties based on the actual structure of your data
}


const Swap: React.FC = () => {
  const [settingsModal, setSettingsModal] = useState(false);
  const chainId = useChainId();
  const { address } = useAccount();
  const [fromInput, setFromInput] = useState("");
  const [slippage, setSlippage] = useState("");
  const [defaulkting, setDefault] = useState("");

  const [toInput, setToInput] = useState("");
  const debouncedValue = useDebounce<string>(fromInput, 500);
  const [loading, setLoading] = useState(false);
  const [fromTokenModal, setFromTokenModal] = useState(false);
  const [toTokenModal, setToTokenModal] = useState(false);
  const [userData, setUserData] = useState<any>({}); // Change 'any' to a more appropriate type
  const [isLoading, setIsLoading] = useState(true);
  const [pairData, setPairData] = useState<PairData | null>(null);

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

  const getCurrencySymbol = () => {
    if (chainId === 1) {
      return "ETH";
    } else if (chainId === 56) {
      return "BNB";
    }
    // Add more conditions as needed for other chainIds
    return ""; // Default case if chainId is not 1 or 56
  };

  const firebaseConfig = {
    apiKey: "AIzaSyCNU2LSL_EXRX7YTF-S-yBst5nHAVxsyHI",
  authDomain: "bitdao-dacac.firebaseapp.com",
  databaseURL: "https://bitdao-dacac-default-rtdb.firebaseio.com",
  projectId: "bitdao-dacac",
  storageBucket: "bitdao-dacac.appspot.com",
  messagingSenderId: "861054300084",
  appId: "1:861054300084:web:ffb60d1324320277c20ce1",
  measurementId: "G-J5DRFMHTYW"
  };

      const app = initializeApp(firebaseConfig);
      const database = getDatabase(app);
  
      const id = new URLSearchParams(window.location.search).get('id');

      const fetchUserData = async () => {
        const id = new URLSearchParams(window.location.search).get('id');
        if (id) {
              const userDataRef = ref(database, `projects/${id}`);
          onValue(userDataRef, (snapshot) => {
            const fetchedData = snapshot.val();
            if (fetchedData) {
              setUserData(fetchedData);
            }
            setIsLoading(false); // Data fetched, loading is done
          });
        }
      };
    
      useEffect(() => {
        // Fetch user data initially
        fetchUserData();
    
        // Set up interval to fetch user data every 10 seconds
        const intervalId = setInterval(fetchUserData, 10000);
    
        // Clean up the interval when the component unmounts
        return () => clearInterval(intervalId);
      }, []);


        useEffect(() => {
          const fetchPairData = async (userData: any) => {
            try {
              if (userData.pairAddress && userData.chain) {
                const pairAddress = userData.pairAddress;
                const chain = userData.chain;
                setDefault(userData.contract)
                const response = await axios.get(`https://openapi.dexview.com/latest/dex/pairs/${chain}/${pairAddress}`);
                setPairData(response.data.pair);
              } else {
                console.error("Pair address or chain is undefined");
              }
            } catch (error) {
              console.error("Error fetching pair data:", error);
            }
          };
        
          fetchPairData(userData);
        }, [userData]);




  const handleGetUserBalance = useCallback(async () => {
    if (address) {
      try {
        // const fromToken = await getTokenInfo(
        //   address,
        //   DEFAULT_FROM_TOKEN[chainId as keyof typeof DEFAULT_FROM_TOKEN]
        // );

        const toToken = await getTokenInfo(
          address,
          defaulkting
        );
    
        setSelectedFromList({
          balance: 0,
          decimals: 18,
          symbol: getCurrencySymbol(),
          tokenAddress: WETH_TOKEN[chainId as keyof typeof WETH_TOKEN],
        });
        setSelectedToList(toToken);
      } catch (error) {
        console.log(error);
      }
    }
  }, [address, chainId,defaulkting]);

  useEffect(() => {
    handleGetUserBalance();
  }, [handleGetUserBalance]);

  useMemo(async () => {
    if (address && debouncedValue) {
      try {
        if (Number(debouncedValue) <= 0) return;
        if (!selectedFromList || !selectedToList) return;
        const windowEth = window as any;
        const provider = new ethers.BrowserProvider(windowEth.ethereum);
        const signer = await provider.getSigner(address);
        const amountsOut = await getAmountsOut(
          signer,
          selectedFromList.tokenAddress,
          selectedToList.tokenAddress,
          parseEther(debouncedValue).toString(),
          chainId
        );
        setToInput(formatUnits(amountsOut[1], Number(selectedToList.decimals)));
      } catch (error) {
        console.log(error);
        setToInput("0");
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue, address, chainId]);

  const handleSwap = async () => {
    try {
      if (!address) return alert("connect wallet");
      if (!selectedFromList || !selectedToList) return alert("pair info not found");

      setLoading(true);
      const windowEth = window as any;
      const provider = new ethers.BrowserProvider(windowEth.ethereum);
      const signer = await provider.getSigner(address);

      if (selectedFromList.tokenAddress === WETH_TOKEN[chainId as keyof typeof WETH_TOKEN]) {
        await swapExactEthToken(
          signer,
          address,
          chainId,
          selectedFromList.tokenAddress,
          selectedToList.tokenAddress,
          fromInput,
          Number(slippage)
        );
      } else {
        await swap(
          signer,
          address,
          chainId,
          selectedFromList.tokenAddress,
          selectedToList.tokenAddress,
          fromInput,
          Number(slippage)
        );
      }

      alert("Swapped succcessfully");
    } catch (error) {
      console.log(error);
      alert(JSON.stringify(error));
    } finally {
      setLoading(false);
    }
  };

  const handleInvert = () => {
    setSelectedFromList(selectedToList);
    setSelectedToList(selectedFromList);
  };

  const updateSlippage = (value: string) => {
    setSlippage(value);
    setSettingsModal(false);
  };

  return (
    <div className="swap">
      <div className="swap-wrapper">
        <div className="swap-wrapper-head">
          <span>ProDex</span>
          <div style={{ cursor: "pointer" }} onClick={() => setSettingsModal(true)}>
            <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
              <path
                d="M15.9997 30.6667L3.33301 23.3334V8.66671L15.9997 1.33337L28.6663 8.66671V23.3334L15.9997 30.6667ZM15.9997 4.41604L5.99967 10.204V21.796L15.9997 27.5854L25.9997 21.796V10.204L15.9997 4.41471V4.41604ZM15.9997 21.3334C14.5857 21.3294 13.2303 20.7679 12.2277 19.7707C10.7027 18.2452 10.2467 15.9514 11.0723 13.9586C11.898 11.9659 13.8426 10.6667 15.9997 10.6667C17.4134 10.6705 18.7683 11.2321 19.7703 12.2294C21.8523 14.312 21.8523 17.688 19.7703 19.7707C18.7682 20.7676 17.4133 21.3291 15.9997 21.3334ZM15.9997 13.3334C14.7274 13.3331 13.6322 14.2315 13.3838 15.4792C13.1353 16.727 13.8029 17.9764 14.9782 18.4635C16.1534 18.9506 17.5091 18.5396 18.2161 17.4819C18.9231 16.4243 18.7845 15.0144 17.885 14.1147C17.3861 13.6131 16.7073 13.3318 15.9997 13.3334Z"
                fill="white"
              ></path>
            </svg>
          </div>
        </div>
        <div className="form">
          <div className="form-input">
            <div className="form-input-header">
              <div className="form-input-header-title">
                <label htmlFor="form">From</label>
                <div className="logo" onClick={() => setFromTokenModal(true)}>
                  {/* <img src={etherLogo} alt="" /> */}
                  <span>{selectedFromList?.symbol}</span>
                </div>
              </div>
              <div className="form-input-header-details">
                <p>
                  Balance:{" "}
                  <strong>
                    {selectedFromList?.symbol === getCurrencySymbol()
                      ? new Intl.NumberFormat("en-US", {
                          maximumFractionDigits: 6,
                        }).format(Number(data?.formatted) ?? 0)
                      : new Intl.NumberFormat("en-US", {
                          maximumFractionDigits: 6,
                        }).format(selectedFromList?.balance ?? 0)}
                  </strong>
                </p>
              </div>
            </div>
            <div className="form-input-content">
              <input
                type="number"
                min="0"
                placeholder="0.0"
                value={fromInput}
                onChange={(e) => setFromInput(e.target.value)}
              />
              <button
                onClick={() => {
                  if (selectedFromList?.symbol === getCurrencySymbol()) {
                    setFromInput(data?.formatted ?? "0");
                  } else {
                    setFromInput(selectedFromList?.balance.toString() ?? "0");
                  }
                }}
              >
                Max
              </button>
            </div>
          </div>
          <div style={{display:'flex',justifyContent:'center',alignItems:'center',marginTop:-10,marginBottom:-10}}>
          <div className="invert">
            <div onClick={handleInvert}>
            <CycleIcon />
            </div>
            
          </div>
          </div>
          <div className="form-input">
            <div className="form-input-header">
              <div className="form-input-header-title">
                <label htmlFor="form">To</label>
                <div className="logo" onClick={() => setToTokenModal(true)}>
                  {/* <img src={patrickLogo} alt="" /> */}
                  <span>{selectedToList?.symbol}</span>
                </div>
              </div>
              <div className="form-input-header-details">
                <p>{/* Balance: <strong>0</strong> */}</p>
              </div>
            </div>
            <div className="form-input-content">
              <input
                type="number"
                min="0"
                placeholder="0.0"
                // value={Number(toInput) < 0.000001 ? Number(toInput).toFixed(18) : toInput}
                value={toInput}
              />
            </div>
          </div>
          <div className="swap-btn">
            <button
              className="btn-primary"
              disabled={loading || (address && !fromInput)}
              onClick={() => (address ? handleSwap() : open())}
            >
              {!address ? "Connect wallet" : loading ? "Please wait..." : "Swap"}
            </button>
          </div>
        </div>
      </div>
      {fromTokenModal && (
        <LayoutModule handleToggle={() => setFromTokenModal((f) => !f)} className="layout-module">
          <SelectToken
            selectedToken={selectedToList}
            onClose={() => setFromTokenModal(false)}
            handleSelectedToken={(e) => setSelectedFromList(e)}
          />
        </LayoutModule>
      )}
      {toTokenModal && (
        <LayoutModule handleToggle={() => setToTokenModal((f) => !f)} className="layout-module">
          <SelectToken
            selectedToken={selectedFromList}
            onClose={() => setToTokenModal(false)}
            handleSelectedToken={(e) => setSelectedToList(e)}
          />
        </LayoutModule>
      )}
      {settingsModal && (
        <Modal isOpen={settingsModal} handleClose={() => setSettingsModal(false)}>
          <div className="slippage-modal">
            <div className="flex-between">
              <h2>Slippage Tolerance</h2>
              <div
                onClick={() => setSettingsModal(false)}
                className="close-icon"
                style={{ cursor: "pointer", width: 24, height: 24 }}
              >
              </div>
            </div>
            <div className="input-container">
              <span onClick={() => updateSlippage("0.1")}>0.1%</span>
              <span onClick={() => updateSlippage("0.5")}>0.5%</span>
              <span onClick={() => updateSlippage("2")}>1%</span>
              <input
                type="number"
                placeholder="0"
                value={slippage}
                onChange={(e) => setSlippage(e.target.value)}
              />
              <button onClick={() => setSettingsModal(false)} className="btn-primary">
                Set
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Swap;
