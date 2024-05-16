import React, { useState , useEffect} from "react";
import axios from "axios";
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue } from 'firebase/database';
import { PoolInfoData } from "../../../data/PoolInfo";
import { ReactComponent as ChevronDownIcon } from "../../../assets/icons/chevron-down.svg";
import { ReactComponent as TopArrowIcon } from "../../../assets/icons/topArrow.svg";
import "./PoolInfo.scss";

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

  liquidity:{
    base: number;
    quote:number;
    usd:number;
  }

  txns:{
    h24:{
      buys:number;
      sells:number;
    }
  }
  // Add other properties based on the actual structure of your data
}

const PoolInfo: React.FC = () => {
  const [showMoreInfo, setShowMoreInfo] = useState<boolean>(false);
  const [pairData, setPairData] = useState<PairData | null>(null);
  const [userData, setUserData] = useState<any>({}); // Change 'any' to a more appropriate type
  const [isLoading, setIsLoading] = useState(true);



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
  const toggleInfoDisplay = () => {
    setShowMoreInfo((prevShowMoreInfo) => !prevShowMoreInfo);
  };

  return (
    <div className="pool-info-wrapper">
      <div className="pool-info-container">
        <h4>POOL INFO</h4>
        {pairData && (
<>
            <div className="poolInfo-content">
              <p>Pair Address</p>
              <p>{pairData.pairAddress.slice(0, 5)}...{pairData.pairAddress.slice(pairData.pairAddress.length - 5)}</p>
            </div>

<div className="poolInfo-content">
<p>Total Volume (24h)</p>
<p>{pairData.volume.h24}</p>
</div>

<div className="poolInfo-content">
<p>Liquidity</p>
<p>${pairData.liquidity.usd}</p>
</div>

<div className="poolInfo-content">
<p>Pooled {pairData.baseToken.symbol}</p>
<p>{pairData.liquidity.base}</p>
</div>

<div className="poolInfo-content">
<p>Pooled {pairData.quoteToken.symbol}</p>
<p>{pairData.liquidity.quote}</p>
</div>

<div className="poolInfo-content">
<p>Total Buy (24h)</p>
<p>{pairData.txns.h24.buys}</p>
</div>

<div className="poolInfo-content">
<p>Total Sells (24h)</p>
<p>{pairData.txns.h24.sells}</p>
</div>

<div className="poolInfo-content">
<p>Market Cap</p>
<p>${pairData.priceUsd * pairData.liquidity.base}</p>
</div>
</>
        )}
            

      </div>
      
    </div>
  );
};

export default PoolInfo;
