import React, { useCallback, useEffect, useMemo, useState } from "react";
// import Logo from "../../assets/icons/download.png";
// import BNBIcon from "../../assets/icons/bnb.svg";
import "./SelectToken.scss";
import { useDebounce } from "usehooks-ts";
import { useAccount, useBalance, useChainId } from "wagmi";
import { ethers } from "ethers";
import { getIsValidToken, getTokenInfo } from "../../../../utils/tokenContract";
import { DEFAULT_TOKENS, WETH_TOKEN } from "../../../../utils/address";

interface ITokenInfo {
  symbol: any;
  decimals: any;
  balance: number;
  tokenAddress: string;
}
interface ISelectToken {
  onClose: () => void;
  handleSelectedToken: (tokenInfo: ITokenInfo) => void;
  selectedToken?: {
    symbol: any;
    decimals: any;
    balance: number;
    tokenAddress: string;
  } | null;
}

const SelectToken: React.FC<ISelectToken> = ({ onClose, handleSelectedToken, selectedToken }) => {
  const [fromAddress, setFromAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const debouncedValue = useDebounce<string>(fromAddress, 500);
  const { address } = useAccount();
  const chainId = useChainId();
  const { data } = useBalance({
    address: address,
  });
  const [selectedList, setSelectedList] = useState<
    {
      symbol: any;
      decimals: any;
      balance: number;
      tokenAddress: string;
    }[]
  >([]);
  const [tokenList, setTokenList] = useState<
    {
      symbol: any;
      decimals: any;
      balance: number;
      tokenAddress: string;
    }[]
  >([]);
  console.log(data);

  const handleGetData = useCallback(async () => {
    try {
      if (!address) return;
      setTokenList(
        await Promise.all(
          DEFAULT_TOKENS.map(async (token) => {
            const tokenDetails = await getTokenInfo(address, token);

            return tokenDetails;
          })
        )
      );
    } catch (error) {
      console.log(error);
    }
  }, [address]);

  useEffect(() => {
    handleGetData();
  }, [handleGetData]);

  useMemo(async () => {
    if (address && debouncedValue) {
      try {
        if (Number(debouncedValue) <= 0) return;
        setLoading(true);
        const windowEth = window as any;
        const provider = new ethers.BrowserProvider(windowEth.ethereum);
        const signer = await provider.getSigner(address);
        console.log(signer);
        const isValid = await getIsValidToken(address, fromAddress);
        if (isValid) {
          const tokenInfo = await getTokenInfo(address, fromAddress);
          setSelectedList([tokenInfo]);
          console.log(tokenInfo);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue, address, chainId]);

  const renderDefaultTokens = (
    <>
      <div
        className="token-data"
        onClick={() => {
          handleSelectedToken({
            balance: Number(data?.formatted),
            decimals: 18,
            symbol: "ETH",
            tokenAddress: WETH_TOKEN[chainId as keyof typeof WETH_TOKEN],
          });
          onClose();
        }}
        style={{
          opacity:
            selectedToken &&
            selectedToken.tokenAddress === WETH_TOKEN[chainId as keyof typeof WETH_TOKEN]
              ? "0.7"
              : 1,
          cursor:
            selectedToken &&
            selectedToken.tokenAddress === WETH_TOKEN[chainId as keyof typeof WETH_TOKEN]
              ? "no-drop"
              : "pointer",
          pointerEvents:
            selectedToken &&
            selectedToken.tokenAddress === WETH_TOKEN[chainId as keyof typeof WETH_TOKEN]
              ? "none"
              : "auto",
        }}
      >
        <div className="token">
          <div>{/* <img src={f.image} alt="" /> */}</div>
          <div>
            <h4>ETH</h4>
            {/* <p>{f.description}</p> */}
          </div>
        </div>
        <div className="price">
          <h5>{data?.formatted}</h5>
        </div>
      </div>
      {tokenList.map((f, index) => {
        return (
          <div
            className="token-data"
            key={index}
            onClick={() => {
              handleSelectedToken(f);
              onClose();
            }}
            style={{
              opacity: selectedToken && selectedToken.tokenAddress === f.tokenAddress ? "0.7" : 1,
              cursor:
                selectedToken && selectedToken.tokenAddress === f.tokenAddress
                  ? "no-drop"
                  : "pointer",
              pointerEvents:
                selectedToken && selectedToken.tokenAddress === f.tokenAddress ? "none" : "auto",
            }}
          >
            <div className="token">
              <div>{/* <img src={f.image} alt="" /> */}</div>
              <div>
                <h4>{f.symbol}</h4>
                {/* <p>{f.description}</p> */}
              </div>
            </div>
            <div className="price">
              <h5>{f.balance}</h5>
            </div>
          </div>
        );
      })}
    </>
  );

  const renderResult = (
    <>
      {selectedList.map((f, index) => {
        return (
          <div
            className="token-data"
            key={index}
            onClick={() => {
              handleSelectedToken(f);
              onClose();
            }}
          >
            <div className="token">
              <div>{/* <img src={f.image} alt="" /> */}</div>
              <div>
                <h4>{f.symbol}</h4>
                {/* <p>{f.description}</p> */}
              </div>
            </div>
            <div className="price">
              <h5>{f.balance}</h5>
            </div>
          </div>
        );
      })}
    </>
  );

  return (
    <div className="select-token-wrapper">
      <div className="select-token-container">
        <div className="select-token-header">
          <h1>Select a Token</h1>
          <div onClick={onClose} className="close-icon">
          </div>
        </div>
      </div>
      <div className="select-token-content">
        <div className="search-box">
          <input
            type="search"
            placeholder="Search name or paste address"
            value={fromAddress}
            onChange={(e) => setFromAddress(e.target.value)}
          />
        </div>
      </div>
      {loading && <p style={{ textAlign: "center" }}>Loading...</p>}
      {!loading && fromAddress && !selectedList.length && (
        <p style={{ textAlign: "center" }}>No results found</p>
      )}
      <div className="token-data-content">{fromAddress ? renderResult : renderDefaultTokens}</div>
      {/* <div className="manage-token">
        <h5>Manage Token</h5>
      </div> */}
    </div>
  );
};

export default SelectToken;
