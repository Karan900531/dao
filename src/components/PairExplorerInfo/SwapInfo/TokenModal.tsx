import React, { useCallback, useEffect, useState } from "react";
import Modal from "../../Modal";
import { useAccount } from "wagmi";
import { ethers } from "ethers";
import { getIsValidToken, getTokenInfo } from "../../../utils/tokenContract";

interface ITokenInfo {
  symbol: any;
  decimals: any;
  balance: number;
  tokenAddress: string;
}
const TokenModal: React.FC<{
  handleClose?: () => void;
  handleData: (data: ITokenInfo) => void;
}> = ({ handleClose, handleData }) => {
  const { address } = useAccount();
  const [tokenAddress, setTokenAddress] = useState("");
  const [tokenModalLoading, setTokenModalLoading] = useState(false);
  const [tokenInfoDetails, setTokenInfoDetails] = useState<{
    symbol: any;
    decimals: any;
    balance: number;
    tokenAddress: string;
  } | null>(null);

  const handleGetTokenDetails = useCallback(async () => {
    if (!address) return;
    if (!ethers.isAddress(tokenAddress)) return setTokenInfoDetails(null);

    if (!(await getIsValidToken(address, tokenAddress))) return setTokenInfoDetails(null);

    setTokenModalLoading(true);
    setTokenInfoDetails(await getTokenInfo(address, tokenAddress));
    setTokenModalLoading(false);
  }, [tokenAddress, address]);

  useEffect(() => {
    handleGetTokenDetails();
  }, [handleGetTokenDetails]);

  return (
    <Modal isOpen handleClose={handleClose}>
      <div className="token-modal">
        <label htmlFor="toTokenAddress">Token Address</label>
        <input
          type="text"
          id="toTokenAddress"
          value={tokenAddress}
          onChange={(e) => setTokenAddress(e.target.value)}
          placeholder="0x123fc5e368e36aba0f2a2554b1f659393b..."
        />
        {tokenModalLoading && <p style={{ textAlign: "center" }}>Loading...</p>}
        {tokenInfoDetails && (
          <div className="flex-between">
            <h4>{tokenInfoDetails.symbol}</h4>
            <button
              className="primary-btn"
              onClick={() => {
                handleData(tokenInfoDetails);
                if (handleClose) handleClose();
                // setFromTokenAddress("");
                // setTokenInfoDetails(null);
              }}
            >
              Add
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default TokenModal;
