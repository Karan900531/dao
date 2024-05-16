import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

import { ReactComponent as InfoIcon } from "../../assets/icons/info.svg";
import { ReactComponent as ChevronDown } from "../../assets/icons/chevron-down.svg";

import "../../components/PairsList/PairsList.scss";
import "./LiveNewPairs.scss";
import { PANCAKE_SUBGRAPH_API, UNISWAP_SUBGRAPH_API } from "../../utils/api";
import { IPair } from "../../constants/types";
import Pair from "./Pair";

import firebase from 'firebase/app';

import 'firebase/database';
import { ReactComponent as eyeIcon } from "../../assets/icons/eye.svg";
import { Link } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue } from 'firebase/database';
import styled from 'styled-components';
import millify from "millify";
import { formatDistanceToNow } from 'date-fns';



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
  pairCreatedAt:any;

  txns:{
    h24:{
      buys:number;
      sells:number;
    }
  }
  // Add other properties based on the actual structure of your data
}

const ProfileImage = styled.img`
  width: 30px;
  height: 30px;
  border-radius: 50%;
`;


const PaginationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  padding:0 20px
`;

const PaginationButtons = styled.div`
  display: flex;
  gap: 10px;
`;

const PageNumber = styled.div`
  font-size: 14px;
`;


const Button = styled.button`
  background-color: #23323c;
  color: #ffba00;
  border:1px solid #000;
  padding: 8px 15px;
  border-radius: 7px;
  cursor: pointer;
`;
const LiveNewPairs = () => {
  const [data, setData] = useState<IPair[]>([]);
  const [isRotated, setIsRotated] = useState<boolean[]>([false, false, false, false, false, false]);
  const [page, setPage] = useState(1);
  const { chainName } = useParams();


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
const userDataRef = ref(database, 'scam');

const userDataRefs = ref(database, 'projects');


const ITEMS_PER_PAGE = 10;

const [searchTerm, setSearchTerm] = useState('');
const [searchTerms, setSearchTerms] = useState('');

const [userData, setUserData] = useState<any[]>([]);
const [userDatas, setUserDatas] = useState<any[]>([]);

const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true); // Add this line for loading state
  const [pairData, setPairData] = useState<PairData | null>(null);
  const [pairDataList, setPairDataList] = useState<PairData[]>([]);



useEffect(() => {
  onValue(userDataRef, (snapshot) => {
    const data = snapshot.val();
    const filteredData = data ? Object.values(data) : [];

    if (searchTerm) {
      const searchTermLC = searchTerm.toLowerCase();
      const searchResults = filteredData.filter((user: any) =>
        user.name.toLowerCase().includes(searchTermLC)
      );
      setUserData(searchResults.reverse());
    } else {
      setUserData(filteredData.reverse());
    }
          setLoading(false); // Data loading is complete

  });
}, [searchTerm]);


useEffect(() => {
  onValue(userDataRefs, (snapshot) => {
    const datas = snapshot.val();
    const filteredDatas = datas ? Object.values(datas) : [];

    if (searchTerms) {
      const searchTermLCs = searchTerms.toLowerCase();
      const searchResultss = filteredDatas.filter((user: any) =>
        user.name.toLowerCase().includes(searchTermLCs)
      );
      setUserDatas(searchResultss.reverse());
    } else {
      setUserDatas(filteredDatas.reverse());
    }
          setLoading(false); // Data loading is complete

  });
}, [searchTerms]);

const totalPages = Math.ceil(userData.length / ITEMS_PER_PAGE);
const lastItemIndex = currentPage * ITEMS_PER_PAGE;
const firstItemIndex = lastItemIndex - ITEMS_PER_PAGE;
const displayedUserData = userData;
const [isFocused, setIsFocused] = useState(false);

const handleFocus = () => {
  setIsFocused(true);
};

const handleBlur = () => {
  setIsFocused(false);
};

const handlePageChange = (newPage: number) => {
  setCurrentPage(newPage);
};

const handlePreviousPage = () => {
  if (currentPage > 1) {
    setCurrentPage(currentPage - 1);
  }
};

const handleNextPage = () => {
  if (currentPage < totalPages) {
    setCurrentPage(currentPage + 1);
  }
};

const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  setSearchTerm(event.target.value);
};


useEffect(() => {
  const fetchPairData = async (user: any) => {
    try {
      const pairAddress = user.pairAddress;
      const chain = user.chain;

      const response = await axios.get(`https://openapi.dexview.com/latest/dex/pairs/${chain}/${pairAddress}`);
      const pairData: PairData = response.data.pair;
      setPairDataList((prevPairDataList) => [...prevPairDataList, pairData]);
    } catch (error) {
      console.error("Error fetching pair data:", error);
    }
  };

  const fetchDataSequentially = async () => {
    setPairDataList([]); // Reset pairDataList before fetching new data

    for (const user of userDatas) {
      await fetchPairData(user);
    }
    setLoading(false);
  };

  fetchDataSequentially();
}, [userDatas]);



const formatVolume = (volume:any) => {
  const abbreviations = ['K', 'M', 'B'];

  const format = (num:any, precision:any) => {
    const index = Math.floor(Math.log10(num) / 3);
    return (num / Math.pow(1000, index)).toFixed(precision) + abbreviations[index - 1];
  };

  return format(volume, 2); // You can adjust the precision as needed
};



const noProjectsMessage = (
  <tr>
    <td colSpan={4} style={{ textAlign: 'center',height:'100px' }}>
      No Project Found
    </td>
  </tr>
);

// Existing code.

const createTableRow = (user: any, index: number) => (
  <tr key={user.userId || index} style={{ cursor: 'pointer' }}>
    <>

    <td>#{index+1}</td>
    {userDatas[index] && (
    <td>
            <Link to={`/pair-explorers?id=${encodeURIComponent(user.userId)}`}>
              <ProfileImage src={userDatas[index].logoPicture} alt="Logo Picture" />
            </Link>
          </td>
    )}

  
      {userDatas[index] && (
          <td >
                    <Link to={`/pair-explorers?id=${encodeURIComponent(user.id)}`} style={{color:'#fff'}}>

            {userDatas[index].name}
         </Link>
          </td>
)}
      <td>
        <Link to={`/pair-explorers?id=${encodeURIComponent(user.link)}`}>
          {user.status}
        </Link>
      </td>

      <td>
        <a href={`${encodeURIComponent(user.link)}`} style={{color:'#ffba00',textDecoration:'underline'}}>
          View Report
        </a>
      </td>

    </>
  </tr>
);


  const handleHeaderClick = (index: number) => {
    setIsRotated((prevState) => prevState.map((value, idx) => (idx === index ? !value : false)));
  };
  return (
    <>

      <div className="live-new-pairs-wrapper">
        <h2>WALL OF SHAME</h2>
        <div className="para flex-item">
          <p>
            New scam found on <span style={{color:'red'}}>PROTRACKERS</span> .
          </p>
        </div>

        <div className="table-wrapper">
          <table className="pair-table">
            <thead>
              <tr>
                <th align="left">
                  <div>
                    <span onClick={() => handleHeaderClick(0)} style={{color:'red'}}>
                      
                     
                    </span>
                  </div>
                </th>

            
                <th align="left">
                  <div>
                    <span onClick={() => handleHeaderClick(0)} style={{color:'red'}}>
                      Logo
                     
                    </span>
                  </div>
                </th>
                <th align="left">
                  <div>
                    <span onClick={() => handleHeaderClick(0)} style={{color:'red'}}>
                      Name
                     
                    </span>
                  </div>
                </th>

                <th align="left">
                  <div>
                    <span onClick={() => handleHeaderClick(0)} style={{color:'red'}}>
                      Date
                     
                    </span>
                  </div>
                </th>

                <th align="left">
                  <div>
                    <span onClick={() => handleHeaderClick(0)} style={{color:'red'}}>
                      
                     
                    </span>
                  </div>
                </th>

              
              
              </tr>
            </thead>
            <tbody>
            { (
                displayedUserData.map((user, index) => createTableRow(user, index))
                )}
            </tbody>
          </table>

          <PaginationContainer>
      <PageNumber>Page {currentPage} of {totalPages}</PageNumber>

        <PaginationButtons>
          <Button onClick={handlePreviousPage}>Previous</Button>
          
          <Button onClick={handleNextPage}>Next</Button>
        </PaginationButtons>
      </PaginationContainer>
        </div>
     
      </div>
    </>
  );
};

export default LiveNewPairs;
