import React,{useState,useEffect} from "react";
import PoolInfo from "./PoolInfo";
import { ReactComponent as SwapIcon } from "../../assets/icons/swapIcon.svg";
import { ReactComponent as PoolIcon } from "../../assets/icons/binocular.svg";
import { initializeApp } from 'firebase/app';
import SwapInfo from "./SwapInfo";
import { getDatabase, ref, onValue } from 'firebase/database';

import "./PairExplorerInfo.scss";
import DextScore from "./DextScore";

const PairExplorerInfo = () => {
  const [activeContent, setActiveContent] = useState("swap-info");
  const [userData, setUserData] = useState<any>({}); // Change 'any' to a more appropriate type
  const [isLoading, setIsLoading] = useState(true);

  


// Firebase Configuration
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

    
        const name = '-NkQzFPk8FvDe1eN08Sl';
    
        if (name) {
          const userDataRef = ref(database, `banner/${name}`);
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
          const handleResize = () => {
            const isMobile = window.innerWidth <= 768; // Change 768 to the desired breakpoint
        

          };
      
          handleResize(); // Call once to set autoplay initially
      
          window.addEventListener('resize', handleResize);
      
          return () => window.removeEventListener('resize', handleResize);
        }, []);
          // Set

  const PairExplorerTabs = [
    {
      label: "Swap",
      icon: SwapIcon,
      content: "swap-info",
    },
    {
      label: "Pool info",
      icon: PoolIcon,

      content: "pool-info",
    },
  ];

  return (
    <div className="pairExplorer-info-wrapper">
      
      
    </div>
  );
};

export default PairExplorerInfo;
