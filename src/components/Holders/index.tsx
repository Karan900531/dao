import React, { useEffect, useState } from "react";
import { parseEther ,formatUnits} from "ethers"; // Import parseEther from ethers.js
import axios from "axios";
import { initializeApp } from 'firebase/app';
import { get,getDatabase, ref, onValue,set } from 'firebase/database';
import { useAccount, useBalance, useChainId } from "wagmi";

import "../TradeHistory/TradeHistory.scss";
import { ReactComponent as FilterIcon } from "../../assets/icons/dropdown-down-arrow.svg";
import { ReactComponent as ChartIcon } from "../../assets/icons/chart.svg";
import etherscan from "../../assets/icons/etherscan.png";


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

interface SwapTransaction {
  hash: string;
  timeStamp: string;
  from: string;
  to: string;
  value: string;
}

const TokenSwapHistory: React.FC = () => {
  const [tokenAddress, setTokenAddress] = useState("");
  const [swapTransactions, setSwapTransactions] = useState<SwapTransaction[]>([]);
  const [pairData, setPairData] = useState<PairData | null>(null);
  const [id, setId] = useState<string>("");
  const [userData, setUserData] = useState<any>({}); // Change 'any' to a more appropriate type
  const [isLoading, setIsLoading] = useState(true);
  const { address } = useAccount();

  useEffect(() => {
    const idParam = new URLSearchParams(window.location.search).get('id');
    setId(idParam ?? "");
    // ... rest of the code
  }, []);
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

  useEffect(() => {
    // Your Firebase configuration
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
        
        // Simulate loading for 2 seconds
        const loadingTimeout = setTimeout(() => {
            setIsLoading(false);
          }, 3000);
      
          // Clean up the timeout when the component unmounts or when data is fetched
          return () => {
            clearTimeout(loadingTimeout);
            if (!isLoading) {
              clearTimeout(loadingTimeout);
            }
          };
        }, []);

  useEffect(() => {
    const fetchPairData = async (userData: any) => {
      try {
        if (userData.pairAddress && userData.chain) {
        const pairAddress = userData.pairAddress;
        const chain = userData.chain;
        setTokenAddress(pairAddress)
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
  }, [userData]);// ... (existing code)

  useEffect(() => {
    const fetchSwapTransactions = async () => {
      try {
        if (address) {

        let apiEndpoint = "";
  
        // Check if userData.chain is BSC
        if (userData.chain === "bsc") {
          apiEndpoint = `https://api.bscscan.com/api?module=account&action=tokentx&address=${tokenAddress}&startblock=0&endblock=999999999&sort=desc&apikey=HN3P1WK7RF9S9BJ8CDYH62SJGIAP2YJUCF`;
        }
        // Check if userData.chain is ETH
        else if (userData.chain === "eth") {
          apiEndpoint = `https://api.etherscan.io/api?module=account&action=tokentx&address=${tokenAddress}&startblock=0&endblock=999999999&sort=desc&apikey=CGU3P6EGBM93NCJJ35KPB3MU9B1R6K55Y4`;
        }
  
        if (apiEndpoint) {
          const response = await fetch(
            `${apiEndpoint}`
          );
  
          const data = await response.json();
  
          if (data.status === "1" && data.message === "OK") {
            // Assuming data.result is an array of transactions
            const transactions = data.result as SwapTransaction[];
  
            // Filter out duplicate transactions and keep only the one with higher value
            const uniqueTransactions = transactions.reduce((acc, transaction) => {
              const existingTransaction = acc.find((t) => t.hash === transaction.hash);
              if (!existingTransaction || parseFloat(transaction.value) > parseFloat(existingTransaction.value)) {
                return [...acc.filter((t) => t.hash !== transaction.hash), transaction];
              }
              return acc;
            }, [] as SwapTransaction[]);


            const filteredTransactions = uniqueTransactions.filter(
              (uniqueTransactions) =>
              uniqueTransactions.from.toLowerCase() === address.toLowerCase() ||
              uniqueTransactions.to.toLowerCase() === address.toLowerCase()
            );

            setSwapTransactions(filteredTransactions);
          } else {
            console.error("Pair address or chain is undefined");
          }
          } else {
            console.error("Error fetching swap transactions:");
          }
        } else {
          console.error("Invalid chain:", userData.chain);
        }
      } catch (error: any) {
        console.error("Error fetching swap transactions:", error.message);
      }
    };
  
    fetchSwapTransactions();
  }, [tokenAddress, userData.chain]);
  
  // ... (rest of the code)
  

  const getTransactionType = (transaction: SwapTransaction): string => {
    // Assuming that the transaction direction can be determined based on 'from' and 'to' addresses
    return transaction.from.toLowerCase() === tokenAddress.toLowerCase() ? "buy" : "sell";
  };
  
  const formatAddress = (address: string): string => {
    // Slice the address to show the first 7 characters from the start and the last 5 characters
    return `${address.slice(0, 7)}...${address.slice(-7)}`;
  };
  
  return (
    <div className="trade-history">
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th className="align-left">Date</th>
              <th>
                <span>
                  Type 
                </span>
              </th>
            
              <th>
                <span>
                  Amount 
                </span>
              </th>
    
              <th>
                <span>
                  Value 
                </span>
              </th>
           
             
             
            </tr>
          </thead>
          <tbody>
          {swapTransactions.slice(0, 15).map((transaction) => (
              <tr key={transaction.hash}>
                <td style={{fontSize:14, color: getTransactionType(transaction) === 'buy' ? '#cdffe7' : 'rgb(255, 129, 129)' }}>{new Date(parseInt(transaction.timeStamp) * 1000).toLocaleString()}</td>
                <td align="center">
                <span style={{fontSize:14,}} className={`type ${getTransactionType(transaction)}`}>{getTransactionType(transaction)}</span>
                </td>
               

                <td style={{ fontSize:14,color: getTransactionType(transaction) === 'buy' ? '#cdffe7' : 'rgb(255, 129, 129)' }}>  {(parseFloat(formatUnits(transaction.value, 18))).toFixed(4)}</td>
                {pairData && (
 <td style={{fontSize:14, color: getTransactionType(transaction) === 'buy' ? '#cdffe7' : 'rgb(255, 129, 129)' }}>$ {(Number(transaction.value)*Number(pairData.priceUsd)/1000000000000000000).toFixed(2)}</td>)}

            {/* <td>
                  <div className="flex-item">
                    <div>
                      <img src={etherscan} alt="etherscan" />
                    </div>
                    <div>
                      <ChartIcon />
                    </div>
                    <div>
                      
                    </div>
                  </div>
                </td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TokenSwapHistory;
