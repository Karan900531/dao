import React, { useState, useEffect, useMemo } from 'react';
import firebase from 'firebase/app';
import DextScore from "../PairExplorerInfo/DextScore"
import 'firebase/database';
import { ReactComponent as eyeIcon } from "../../assets/icons/eye.svg";
import { Link } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import axios from "axios";
import QuoteRequestPopup from './Popup'; // Import the popup component
import DataTsx from './PopData'; // Import the popup component
import {fetchNFTHoldingsForAddress,getSigner} from "../../utils/nft"
import { useAccount } from 'wagmi';
import { NFTS } from "../../utils/address";
import { getDatabase, ref, onValue } from 'firebase/database';
import styled from 'styled-components';
import millify from "millify";
import { formatDistanceToNow } from 'date-fns';
import CustomDropdown from './Dropdown';
import CustomDropdown2 from './Dropdown2';
import { useToasts } from 'react-toast-notifications';


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
// Styled Components
const Section = styled.section`
  padding: 20px 0;
  @media (max-width: 768px) {
    max-width:100%;
    overflow:auto
    margin-left:50px;
  }
  
  .drops{
    display:flex;
    @media (max-width: 768px) {
      display:flex;
      gap:20px;
      flex-direction:column;
    }
  }
`;

const Gop = styled.div`
  border: 2px solid black;
  background: var(--background);
  padding: 10px;
  border-radius: 10px;
  @media (max-width: 768px) {
    max-width: 100%;
  }
`;


const Container = styled.div`
  width: 100%;
  margin: 0 auto;
`;

const SearchContainer = styled.div`
  margin: 20px 0;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 5px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 30px;
  @media (max-width: 768px) {
    max-width:100%;
    overflow:auto;

  }
 
`;
const TableRow = styled.tr`
`;

const TableData = styled.td`
  padding: 10px;
  font-size:14px;
  // width:fit-content;
    border-bottom: 1px solid #000;

`;

const ProfileImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
`;

const MainGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
gap:10px;  
margin-top:20px;

z-index:1;

@media (max-width: 768px) {
  grid-template-columns: 1fr;
  gap:30px;

}
`;

const HeaderItem = styled.div`
  background-color: #000;
  padding: 5px;
  margin-top:0px;
  height: 55px;
  border: none;
  text-align: left;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
`;

const DataItem = styled.div`
  padding: 10px;
  padding-bottom:0px;


  .voted{
    margin-top:-31px;
    width:fit-content;
    margin-left:78%;
    width:60px;
    font-size:12px !important;
    color:white;
    display:flex;
    align-items:center;
    justify-content:center;
    height:25px;
    
    border-radius:50px;
    background-color:var(--green-clr);

    @media (max-width: 768px) {
      margin-left:70%;

    }
  }
  .voteds{
    margin-top:-31px;
    width:fit-content;
    margin-left:78%;
    width:60px;
    font-size:12px !important;
    color:white;
    display:flex;
    align-items:center;
    justify-content:center;
    height:25px;
    
    border-radius:50px;
    background-color:#ea3942;
    @media (max-width: 768px) {
      margin-left:70%;

    }
    
  }
`;

const Button = styled.button`
  background-color: #23323c;
  color: #ffba00;
  border:1px solid #000;
  padding: 8px 15px;
  border-radius: 7px;
  cursor: pointer;
`;
const PaginationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
`;

const PaginationButtons = styled.div`
  display: flex;
  gap: 10px;
`;

const PageNumber = styled.div`
  font-size: 14px;
`;

const LoaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px; /* Adjust the height as needed */
`;


const Header = styled.div`
  display:flex;
  align-items:center;
justify-content:space-between; 
gap:15px; margin-bottom:20px;
  margin-top:0px;


  @media (max-width: 768px) {
    grid-template-columns:1fr;

  }

`;


const MainTable = styled.div`
  width: 100%; /* Adjust the width for mobile screens */
  padding: 0 20px 20px;
  border-radius: 10px;
 


  .tablescroll{
    overflow-x: auto;
   
    &::-webkit-scrollbar {
      height: 2px; /* Adjust the scrollbar width as needed */
    }

    &::-webkit-scrollbar-track {
      background: #000; /* Track color */
    }
    
    /* Scrollbar Handle */
    &::-webkit-scrollbar-thumb {
      background: #a37800; /* Handle color */
    }
    
    /* Scrollbar Handle on hover */
    &::-webkit-scrollbar-thumb:hover {
      background: #a37800; /* Handle color on hover */
    }
    
  
    // Add mobile styles here
    @media (max-width: 768px) {
      // Adjust styles for smaller screens
      width: 100%;
    }

  }
`;



const TableHead = styled.thead`
  background-color: #000;
  padding:5px;
  height:55px;

  border:none;

  th{
    padding: 10px;
    text-align: left;
    font-weight: bold;
    margin-bottom:20px;
  }

  tr{
    padding:5px;
  }
`;



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
const userDataRef = ref(database, 'proposal');

const ITEMS_PER_PAGE = 100000;

const AuditedProjects: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [userData, setUserData] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true); // Add this line for loading state
    const [pairData, setPairData] = useState<PairData | null>(null);
    const [pairDataList, setPairDataList] = useState<PairData[]>([]);

    const { address } = useAccount();


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
  const [showPopup, setShowPopup] = useState(false);
  const [showPopups, setShowPopups] = useState(false);


  const handleCreateNowClick = () => {
    if (!address)         return addToast("Connect Wallet", { appearance: 'error', autoDismiss: true, autoDismissTimeout: 2000 });

    if (Object.values(nftHoldings).reduce((acc, holdings) => acc + parseFloat(holdings), 0) <= 0) {
      return addToast("You don't have any 8Bit Chain NFTs", { appearance: 'error', autoDismiss: true, autoDismissTimeout: 2000 });
    }
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  
  const handleCreateNowClicks = () => {
    setShowPopups(true);
  };

  const handleClosePopups = () => {
    setShowPopups(false);
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

  const options=["All","Voting","Closed"];
  const sort=["Name","Time"];


  const formatVolume = (volume:any) => {
    const abbreviations = ['K', 'M', 'B'];
  
    const format = (num:any, precision:any) => {
      const index = Math.floor(Math.log10(num) / 3);
      return (num / Math.pow(1000, index)).toFixed(precision) + abbreviations[index - 1];
    };
  
    return format(volume, 2); // You can adjust the precision as needed
  };
  

   const noProjectsMessage = (
    <TableRow>
      <TableData colSpan={4} style={{ textAlign: 'center',height:'100px' }}>
        No Project Found
      </TableData>
    </TableRow>
  );

// Existing code...
const currentTime = new Date(); // Get the current time

const [filterOption, setFilterOption] = useState<string>('All');

  // Step 2: Create a function to handle filter change
  const handleFilterChange = (option:any) => {
    setFilterOption(option);
  };

  // Step 3: Apply filtering based on the selected option
  const filteredUserData = useMemo(() => {
    if (filterOption === "Voting") {
      return userData.filter((user: any) => new Date(user.dateend) > currentTime);
    } else if (filterOption === "Closed") {
      return userData.filter((user: any) => new Date(user.dateend) <= currentTime);
    } else {
      return userData;
    }
  }, [userData, filterOption, currentTime]);

  const [sortOption, setSortOption] = useState<string>('Time'); // Step 1: State variable for sorting option

  // Step 2: Function to handle changes in the sorting option
  const handleSortChange = (option:any) => {
    setSortOption(option);
  };

  // Step 3: Apply sorting based on the selected option
  const sortedUserData = useMemo(() => {
    if (sortOption === "Name") {
      return [...filteredUserData].sort((a, b) => a.name.localeCompare(b.name));
    }  else {
      return filteredUserData;
    }
  }, [filteredUserData, sortOption]);

  const [nftHoldings, setNFTHoldings] = useState<Record<string, string>>({});
  const { addToast } = useToasts();

  useEffect(() => {
    const fetchNFTHoldings = async () => {
      try {
        if (!address) return;
        const provider = await getSigner(address);
        const holdings = await fetchNFTHoldingsForAddress(provider, address, NFTS);
        setNFTHoldings(holdings);
      } catch (error) {
        console.error('Error fetching NFT holdings:', error);
      }
    };

    fetchNFTHoldings();
  }, [address]); 

  const totalHoldings = Object.values(nftHoldings).reduce((acc, holdings) => acc + parseFloat(holdings), 0);

const createGridItem = (user: any, index: number) => {
  const userId = user.userId; // Get userId from user object

  const endDate = new Date(`${user.dateend}:00`);
  const isExpired = endDate > currentTime;

  return (
    <>
      <Gop key={userId || index} style={{ cursor: 'pointer' }}>
        {userData && (
          <>
            {isExpired ? (
              <>
                <DataItem onClick={handleCreateNowClicks}>
                  <p className='voted' style={{textAlign:'center',}}>
                    <div>Voting</div>
                  </p>
                </DataItem>
              </>
            ) : (
              <>
                <DataItem >
                  <p className='voteds' style={{textAlign:'center'}}>

                    <div>Closed</div>
                  </p>
                </DataItem>
              </>
            )}

            <DataItem >
            <Link to={`/proposal-details?id=${encodeURIComponent(user.userId)}`}>
              <div style={{display:'flex',justifyContent:'space-between'}}>
              <p style={{fontSize:15}}>#{index+1}</p>
              <span style={{backgroundColor:'#ccc',color:'black',marginLeft:20,borderRadius:5,padding:' 2px 10px',fontSize:12}}>{user.whom}</span>

              </div>
              </Link>
            </DataItem>

            <DataItem onClick={handleCreateNowClicks}>
            <Link to={`/proposal-details?id=${encodeURIComponent(user.userId)}`}>

              <span>{user.name}</span></Link>
            </DataItem>

            <DataItem onClick={handleCreateNowClicks}>
            <Link to={`/proposal-details?id=${encodeURIComponent(user.userId)}`}>

              <p style={{fontSize:15,marginBottom:40}}>{user.overview}</p></Link>
            </DataItem>

            {isExpired ? (
              <>
                <DextScore id={userId} allowInteraction={true} />
                <DataItem onClick={handleCreateNowClicks}>
                  <p style={{marginBottom:10}}>
                    Time Left to Vote : <span style={{color:'white'}}>
                    {formatDistanceToNow(new Date(endDate), { addSuffix: false })}
                    </span>
                  </p>
                </DataItem>
              </>
            ) : (
              <>
                <DextScore id={userId} allowInteraction={false} />
                <DataItem onClick={handleCreateNowClicks}>
                  <p style={{marginBottom:10}}>Time Left to Vote : <span style={{color:'white'}}>None</span></p>
                </DataItem>
              </>
            )}
          </>
        )}
      </Gop>
    </>
  );
};
  const redirectToReport = (userId: string) => {
    const encodedName = encodeURIComponent(userId);
    window.location.href = `kycproject.html?name=${encodedName}`;
  };


  


  return (
    <Section>
      <Container>
        <Header>
        <header>
        <h2 className="dashboard-heading" style={{marginLeft:30,marginBottom:10}}>Proposal List</h2>
        </header>
       
<div><div onClick={handleCreateNowClick} style={{color:'#ffba00',fontSize:14,marginRight:30,cursor:'pointer'}}>+ Create Now</div>
      {showPopup && <QuoteRequestPopup onClose={handleClosePopup} />}</div>
        </Header>
        
      </Container>

      <div className='drops'>
        <div><p style={{marginLeft:30,marginBottom:5}}>Proposal Status</p> <CustomDropdown   options={options}
        onChange={handleFilterChange}
        value={filterOption}/></div>

<div><p style={{marginLeft:30,marginBottom:5}}>Sort By</p> 
<CustomDropdown2   options={sort}
        onChange={handleSortChange}
        value={sortOption}/></div>
       

      </div>
    
      <div style={{display:'flex',justifyContent:'center'}}>
     
<MainTable>
      {loading ? ( // Conditional rendering based on loading state
      <LoaderContainer>
        <p>Loading...</p>
      </LoaderContainer>
    ) : (
      <div className="tablescroll">
 <MainGrid>
 {sortedUserData.map((user, index) => createGridItem(user, index))}
              </MainGrid>
      </div>
      )}
 
      </MainTable>
      </div>
    </Section>
  );
};

export default AuditedProjects;
