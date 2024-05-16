import React, { useCallback, useEffect, useRef, useState } from "react";
import PairExplorerInfo from "../../components/Chart";
import PairExplorerInfos from "../../components/Data";

import Card from "../../components/Card";

import PairExplorerDetails from "../../components/PairExplorerDetails";
import Favorites from "../../components/Favorites";
import "./PairExplorers.scss";
import { Navigate, useParams } from "react-router-dom";
import axios from "axios";
import { PANCAKE_SUBGRAPH_API, UNISWAP_SUBGRAPH_API } from "../../utils/api";
import { doc, getDoc, setDoc, Timestamp } from "firebase/firestore";
import { db } from "../../utils/firebase";
import { usePairDetailsStore } from "../../store/pairDetailsStore";



const PairExplorer: React.FC = () => {
  return (
    <div className="pair-explorer-wrapper" style={{padding:0}}>
      <div className="pad">
      <h2 className="dashboard-heading">Dashboard</h2>

      </div>
      <div className="grid-items">
      
        

        
        <PairExplorerInfo />
        <PairExplorerInfos/>
        <Card />


        </div>
       
    </div>
  );
};

export default PairExplorer;


