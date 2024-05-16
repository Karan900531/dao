import React, { useEffect, useRef, useState } from "react";
import { Web3Button, useWeb3Modal } from "@web3modal/react";
import { useDarkMode } from "usehooks-ts";
import Logo from "../../assets/images/sidebarLogo.png";
// import { ReactComponent as ChevronDownIcon } from "../../assets/icons/chevron-down.svg";
import { ReactComponent as SearchIcon } from "../../assets/icons/search.svg";
import { ReactComponent as MenuIcon } from "../../assets/icons/menu.svg";
// import { ReactComponent as SettingIcon } from "../../assets/icons/setting.svg";
import { ReactComponent as MoonIcon } from "../../assets/icons/moon.svg";
import { ReactComponent as SunIcon } from "../../assets/icons/sun.svg";
import { ReactComponent as Close } from "../../assets/icons/close.svg";
import { ReactComponent as Home } from "../../assets/icons/home.svg";
import { ReactComponent as Live } from "../../assets/icons/live.svg";
import { ReactComponent as Pair } from "../../assets/icons/liveexplorer.svg";
import { AnimatePresence, motion } from "framer-motion";
import { ReactComponent as WallOfShame } from "../../assets/icons/wallofshame.svg";
import Add from "../../assets/icons/add.svg";

import { ReactComponent as DownArrowIcon } from "../../assets/icons/down-arrow.svg";
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue } from 'firebase/database';
import styled from 'styled-components';
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import Accordion from "../Accordion";
import { chainList } from "../../data/chainList";
import millify from "millify";
import axios from "axios";

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

const Section = styled.section`
  padding: 20px 0;


  
`;

const Container = styled.div`
  width: 90%;
  margin: 0 auto;
`;

const SearchContainer = styled.div`
  margin: 20px 0;
`;

const SearchInput = styled.input`
 
`;

const Table = styled.table`


`;
const TableRow = styled.tr`
`;

const TableData = styled.td`
  padding: 10px;
  width:fit-content;
    border-bottom: 1px solid var(--background);

`;

const ProfileImage = styled.img`
  width: 30px;
  height: 30px;
  margin-right:20px;
  border-radius: 50%;
`;

const Button = styled.button`
  background-color: rgba(255, 244, 140, 0.25);
  color: #ffba00;
  border:1px solid #ffba00;
  padding: 5px 10px;
  border-radius: 5px;
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
  display:grid;
  grid-template-columns:1fr 1fr;
  margin-bottom:20px;

  @media (max-width: 768px) {
    grid-template-columns:1fr;

  }

`;


const MainTable = styled.div`
  width: 90%; /* Adjust the width for mobile screens */
  background: black;
  padding: 20px;
  border-radius: 20px;
 


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
  background-color: var(--background);
  padding:5px;
  height:55px;
  border:none;

  th{
    padding: 10px;
    text-align: left;
    font-weight: bold;
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
const userDataRef = ref(database, 'projects');

const ITEMS_PER_PAGE = 10;

const Navigation: React.FC = () => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const handleSearchFocus = () => {
    setIsSearchFocused(true);
  };
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement; // Cast event.target as HTMLElement
  
      // Check if target is not null and if it's not inside .searbar or .tablescroll
      if (
        target && // Check if target is not null
        !target.closest(".searbar") && // Check if the click is not inside the search bar
        !target.closest(".tablescroll") // Check if the click is not inside the table (when it's displayed)
      ) {
        setIsSearchFocused(false); // Set isSearchFocused to false
      }
  
      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        setOpenDropdown(false);
      }
    };
  
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);
  

  const [searchTerm, setSearchTerm] = useState('');
  const [userData, setUserData] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true); // Add this line for loading state


  useEffect(() => {
    onValue(userDataRef, (snapshot) => {
      const data = snapshot.val();
      const filteredData = data ? Object.values(data) : [];

      if (searchTerm) {
        const searchTermLC = searchTerm.toLowerCase();
        const searchResults = filteredData.filter((user: any) =>
          user.pairAddress.toLowerCase().includes(searchTermLC)
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
  const displayedUserData = userData.slice(firstItemIndex, lastItemIndex);
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

   const noProjectsMessage = (
    <TableRow>
      <TableData colSpan={4} style={{ textAlign: 'center',height:'100px' }}>
        No Project Found
      </TableData>
    </TableRow>
  );
  const createTableRow = (user: any) => (
    <TableRow key={user.userId}>
  
      <TableData >             <a href={`/pair-explorers?id=${encodeURIComponent(user.userId)}`}>
  <div style={{display:'flex',alignItems:'center'}}> <ProfileImage src={user.logoPicture} alt="Logo Picture" />
{user.name}</div></a></TableData>

    </TableRow>
  );

  const redirectToReport = (userId: string) => {
    const encodedName = encodeURIComponent(userId);
    window.location.href = `kycproject.html?name=${encodedName}`;
  };

  const { isDarkMode, toggle } = useDarkMode();
  const [openClose, setOpenClose] = useState(false);
  const { open } = useWeb3Modal();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [openDropdown, setOpenDropdown] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const [pairData, setPairData] = useState<PairData | null>(null);

  useEffect(() => {
    const fetchPairData = async () => {
      try {
       
          const pairAddress = "0x8c9e29a9c6e1bcf7363cd4d0e2b75613f1b551d2";
  
          const response = await axios.get(`https://openapi.dexview.com/latest/dex/pairs/bsc/${pairAddress}`);
          setPairData(response.data.pair);
        
      } catch (error) {
        console.error("Error fetching pair data:", error);
      }
    };
  
    fetchPairData();
  }, []);

  console.log(location);

  useEffect(() => {
    if (openClose) {
      document.body.style.overflowY = "hidden";
      document.body.style.height = "100vh";
    } else {
      document.body.style.overflowY = "initial";
      document.body.style.height = "initial";
    }
  }, [openClose]);

  useEffect(() => {
    if (isDarkMode) {
      if (document.body.classList.contains("light")) {
        document.body.classList.remove("light");
      }
      document.body.classList.add("dark");
    } else {
      if (document.body.classList.contains("dark")) {
        document.body.classList.remove("dark");
      }
      document.body.classList.add("light");
    }
  }, [isDarkMode]);

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setOpenDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const currentChain = chainList.find((f) =>
    location.pathname.toLowerCase().includes(f.label.toLowerCase())
  );

  return (
    <div className="navigation-wrapper">
      <div className="mx">
        <div className="navigation-container flex-item">
      
          {/* <div className="all-chains-drop-down flex-item">
            <p>All Chains</p>
            <ChevronDownIcon />
          </div> */}
          <div className="searbar flex-item">
            <div className="searchBar-icon">
              <SearchIcon />
            </div>
            <input 
    type="search" 
    placeholder="Search Name, Symbol, Contract Address" 
    value={searchTerm}
    onChange={handleSearchChange}
    onFocus={handleSearchFocus}

  />
          </div>
          <div className="settings flex-item">
      

            {/* <div className="setting-icon circlebg">
              <SettingIcon />
            </div> */}
            {/* <div className="search-icon circlebg">
              <SearchIcon />
            </div> */}
            {/* <div className="star-icon circlebg">
              <StarIcon />
            </div> */}
          
          </div>
        </div>

        <AnimatePresence>
          {openClose && (
            <motion.div
              className="sidebar-backdrop"
              onClick={() => setOpenClose(false)}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
            >
              <motion.div
                className="bar"
                onClick={(e: any) => e.stopPropagation()}
                animate={{ right: 0, transitionDelay: "-200ms" }}
                exit={{ right: -300 }}
                initial={{ right: -300 }}
              >
                <div className="header-side-bar">
                  <div className="close-icon" onClick={() => setOpenClose(false)}>
                    <Close />
                  </div>
                  <Link to="/">
                    <div className="logo flex-item">
                      <img src={Logo} alt="" />
                      <span>PROTRACKER</span>
                    </div>
                  </Link>
                  <div style={{ flex: 1 }}>
                    <nav>
                      <NavLink
                        to="/"
                        className="list flex-item"
                        onClick={() => setOpenClose(false)}
                      >
                        <Home />
                        <span>EagleEye Insight</span>
                      </NavLink>
                      <NavLink
                        to="/live-new-pairs"
                        className="list flex-item"
                        onClick={() => setOpenClose(false)}
                      >
                        <Live />
                        <span>New Market Entries</span>
                      </NavLink>
                      <NavLink
                        to="/pair-explorers?id=-Npp1crw5M1UqKlNXetB"
                        className="list flex-item"
                        onClick={() => setOpenClose(false)}
                      >
                        <Pair />
                        <span>Pair Analyzer</span>
                      </NavLink>
                      <NavLink
                        to="/scam"
                        className="list flex-item"
                        onClick={() => setOpenClose(false)}
                      >
                        <WallOfShame />
                        <span>Wall of Shame</span>
                      </NavLink>

                      <NavLink
                        to="/add"
                        className="list flex-item"
                        onClick={() => setOpenClose(false)}
                      >
              <img src={Add} alt="" width={18} height={18} style={{marginRight:'10px'}} />
                        <span>List Coin</span>
                      </NavLink>
                      <Accordion />
                    </nav>
                    <div className="web3-btn">
                      <button
                        onClick={() => {
                          open();
                          setOpenClose(false);
                        }}
                      >
                        Connect Wallet
                      </button>
                    </div>
                  </div>
                  <div className="sidebar-footer">
                  {pairData && (
            <div className="stats">
              <span>$ {millify(Number(pairData.priceUsd), { precision: 5 })}</span>
              <div></div>
            </div>
          )}
                    <div className="controls">
                      <button>Buy w8Bit </button>
                    </div>

                    <p className="powered-by">
                      Powered By <a href="/">8BitChain</a>
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {isSearchFocused && (
  <Table style={{ 
  
    display: isSearchFocused ? 'table' : 'none'
  }}>
    <tbody>
      {displayedUserData.length === 0 ? (
        noProjectsMessage
      ) : (
        displayedUserData.map((user) => createTableRow(user))
      )}
    </tbody>
  </Table>
)}
    </div>
  );
};

export default Navigation;
