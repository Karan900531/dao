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
  width: 50px;
  height: 50px;
  border-radius: 50%;
`;
const LiveNewPairs = () => {
  const [data, setData] = useState<IPair[]>([]);
  const [isRotated, setIsRotated] = useState<boolean[]>([false, false, false, false, false, false]);
  const [page, setPage] = useState(1);
  const { chainName } = useParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [userData, setUserData] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true); // Add this line for loading state
    const [pairData, setPairData] = useState<PairData | null>(null);
    const [pairDataList, setPairDataList] = useState<PairData[]>([]);

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
  const userDataRef = ref(database, 'projects');
  
  const ITEMS_PER_PAGE = 10;
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

      for (const user of userData) {
        await fetchPairData(user);
      }
      setLoading(false);
    };

    fetchDataSequentially();
  }, [userData]);

  

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


  const createTableRow = (user: any, index: number) => (
    <tr key={user.userId || index} style={{ cursor: 'pointer' }}>
      {pairDataList[index] && (
        <>
  
          <td>
            <Link to={`/pair-explorers?id=${encodeURIComponent(user.userId)}`}>
              <ProfileImage src={user.logoPicture} alt="Logo Picture" />
            </Link>
          </td>
  
          {/* Check if pairDataList[index] and its properties are not null before accessing them */}
          {pairDataList[index] && pairDataList[index].baseToken && pairDataList[index].quoteToken && (
            <td>
              <Link to={`/pair-explorers?id=${encodeURIComponent(user.userId)}`}>
                {pairDataList[index].baseToken.symbol}/
                <span style={{ fontSize: 12, color: '#cccccc' }}>
                  {pairDataList[index].quoteToken.symbol}
                </span>
                <br />
                <span style={{ fontSize: 12, color: '#cccccc' }}>
                  {pairDataList[index].pairAddress.slice(0, 5)}...
                  {pairDataList[index].pairAddress.slice(pairDataList[index].pairAddress.length - 5)}
                </span>
              </Link>
            </td>
          )}
     <td>
           <span>{user.name}</span>
          </td>
  
  
          {/* Additional checks for other properties of pairDataList[index] */}
          {pairDataList[index] && pairDataList[index].priceUsd != null && (
            <td>
              <Link to={`/pair-explorers?id=${encodeURIComponent(user.userId)}`}>
                $ {millify(Number(pairDataList[index].priceUsd), { precision: 5 })}
              </Link>
            </td>
          )}
  
          {pairDataList[index] && pairDataList[index].priceChange && (
            <td style={{ color: pairDataList[index].priceChange.h24 >= 0 ? "green" : "red" }}>
              {pairDataList[index].priceChange.h24.toFixed(2)}%
            </td>
          )}
  
  {pairDataList[index] && pairDataList[index].priceChange && (
            <td >
              {formatDistanceToNow(new Date(pairDataList[index].pairCreatedAt * 1000), { addSuffix: true })}
            </td>
          )}
  
  {pairDataList[index] && pairDataList[index].priceChange && (
            <td >
              $ {pairDataList[index].volume.h24.toFixed(2)} 
            </td>
          )}
  
  {pairDataList[index] && pairDataList[index].priceChange && (
            <td >
              {formatVolume(pairDataList[index].liquidity.usd)}
            </td>
          )}
  
  {pairDataList[index] && pairDataList[index].priceChange && (
            <td >
              $ {formatVolume(pairDataList[index].priceUsd * pairDataList[index].liquidity.base)}
            </td>
          )}
        </>
      )}
    </tr>
  );
  const handleGetData = useCallback(async () => {
    try {
      if (chainName === "ethereum") {
        setLoading(true);
        const { data } = await axios.post(UNISWAP_SUBGRAPH_API, {
          query: `query($first:Int!,$skip:Int!){
            pools(first:$first,skip:$skip,orderBy:createdAtTimestamp,orderDirection:desc){
              id
              token0Price
              token1Price
              volumeUSD
              createdAtTimestamp
              untrackedVolumeUSD
              token0 {
                id
                symbol
              }
              token1 {
                id
                symbol
              }
            }
          }`,
          variables: {
            first: 10,
            skip: (page - 1) * 10,
          },
        });

        if (data["errors"]) return console.log(data);

        setData(data.data.pools);
        setLoading(false);
      } else {
        setLoading(true);
        const { data } = await axios.post(PANCAKE_SUBGRAPH_API, {
          query: `query($first:Int!){
            pools(first:$first,skip:$skip,orderBy:createdAtTimestamp,orderDirection:desc){
              id
              token0Price
              token1Price
              volumeUSD
              createdAtTimestamp
              untrackedVolumeUSD
              token0 {
                id
                symbol
              }
              token1 {
                id
                symbol
              }
            }
          }`,
          variables: {
            first: 10,
            skip: (page - 1) * 10,
          },
        });

        if (data["errors"]) return console.log(data);

        setData(data.data.pools);
        setLoading(false);
      }
      console.log(data);
    } catch (error) {
      console.log(error);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chainName, page]);

  useEffect(() => {
    handleGetData();
  }, [handleGetData]);

  const handleHeaderClick = (index: number) => {
    setIsRotated((prevState) => prevState.map((value, idx) => (idx === index ? !value : false)));
  };
  return (
    <>

      <div className="live-new-pairs-wrapper">
        <h2>RECENTLY LISTED PAIRS</h2>
        <div className="para flex-item">
          <p>
            New pairs listed on <span>PROTRACKERS</span> exchanges with pool variation in real time
          </p>
        </div>

        <div className="table-wrapper">
          <table className="pair-table">
            <thead>
              <tr>
                <th align="left">
                  <div>
                    <span onClick={() => handleHeaderClick(0)}>
                      Logo
                     
                    </span>
                  </div>
                </th>

                <th align="left">
                  <div>
                    <span onClick={() => handleHeaderClick(0)}>
                      Pair
                     
                    </span>
                  </div>
                </th>

                <th align="left">
                  <div>
                    <span onClick={() => handleHeaderClick(0)}>
                      Name
                     
                    </span>
                  </div>
                </th>

                <th align="left">
                  <div>
                    <span onClick={() => handleHeaderClick(0)}>
                      Price
                     
                    </span>
                  </div>
                </th>

                <th align="left">
                  <div>
                    <span onClick={() => handleHeaderClick(0)}>
                      %24h
                     
                    </span>
                  </div>
                </th>

                <th align="left">
                  <div>
                    <span onClick={() => handleHeaderClick(0)}>
                      Created
                     
                    </span>
                  </div>
                </th>

                <th align="left">
                  <div>
                    <span onClick={() => handleHeaderClick(0)}>
                      Volume
                     
                    </span>
                  </div>
                </th>

                <th align="left">
                  <div>
                    <span onClick={() => handleHeaderClick(0)}>
                      Liquidity
                     
                    </span>
                  </div>
                </th>

                <th align="left">
                  <div>
                    <span onClick={() => handleHeaderClick(0)}>
                      Mkt. Cap.
                     
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
        </div>
     
      </div>
    </>
  );
};

export default LiveNewPairs;
