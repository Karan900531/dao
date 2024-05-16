import React, { useCallback, useEffect, useRef, useState } from "react";
import PairExplorerInfo from "../../components/PairExplorerInfo";
import PairExplorerDetails from "../../components/PairExplorerDetails";
import Favorites from "../../components/Favorites";
import "./PairExplorer.scss";
import { Navigate, useParams } from "react-router-dom";
import axios from "axios";
import { PANCAKE_SUBGRAPH_API, UNISWAP_SUBGRAPH_API } from "../../utils/api";
import { doc, getDoc, setDoc, Timestamp } from "firebase/firestore";
import { db } from "../../utils/firebase";
import { usePairDetailsStore } from "../../store/pairDetailsStore";

const BaseExplorer = () => {
  const [loading, setLoading] = useState(false);
  const isMountedRef = useRef(false);
  const setPairInfo = usePairDetailsStore((store) => store.setPairInfo);
  const pairInfo = usePairDetailsStore((store) => store.pairInfo);

  const handleGetData = useCallback(async () => {
    try {
      // ... (rest of the code remains the same)
    } catch (error) {
      console.log(error);
    }
  }, []);

  const handleGetCollection = async () => {
    try {
      // ... (rest of the code remains the same)
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!isMountedRef.current) {
      handleGetData();
      isMountedRef.current = true;
    } else {
      // This code will run on subsequent renders
    }
  }, [handleGetData]);

  return (
    <div className="mx">
    


    

        <div className="grid-item">
        <PairExplorerDetails/>
          <PairExplorerInfo />
        </div>

    </div>
  );
};

const PairExplorer: React.FC = () => {
  return (
    <div className="pair-explorer-wrapper">
      <BaseExplorer />
    </div>
  );
};

export default PairExplorer;


