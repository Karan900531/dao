import React, { useState, useEffect } from 'react';
import firebase from 'firebase/app';
import './Comment.scss';
import Comment from "./8bitchain1.png"
import 'firebase/database';
import { ReactComponent as eyeIcon } from "../../assets/icons/eye.svg";
import { Link } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import axios from "axios";
import { getDatabase, ref, onValue } from 'firebase/database';
import styled from 'styled-components';
import millify from "millify";
import { format } from 'date-fns';
import Modal from 'react-modal';

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
// Styled Components
const Section = styled.section`
background: var(--background);
  border-radius:10px;
  margin-top:20px;
  overflow:auto;
  height:500px;
  max-height:500px;
  
`;

const Container = styled.div`
  width: 100%;
  margin: 0 auto;
`;

const SearchContainer = styled.div`
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
 
`;
const TableRow = styled.tr`
`;

const TableData = styled.td`
  font-size:14px;
  width:fit-content;
    border-bottom: 1px solid var(--background);

 
    .finalview{
      width:100%;
      display:flex;
      flex-direction:column;
      padding:10px 0;
      border-bottom:1px solid #cccccc;

      .avatar{
        display:flex;
        align-items:center;

        span{
          color:#cccccc;
        }

        p{
          font-size:14px;
          background-color:green;
border-radius:5px;
margin-left:10px;
          padding:2px 7px;
        }
      }
    }

`;

const ProfileImage = styled.img`
  width: 50px;
  height: 50px;
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
  margin-bottom:5px;
h2{
  font-size:12px;
}
.comment-head {
  background: var(--drop-down-clr);
  padding: 8px 14px;
  width:100%;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  h5 {
    font-family: var(--font-light);
    font-size: 13px;
    letter-spacing: 0.5px;
  }
}
  @media (max-width: 768px) {
    grid-template-columns:1fr;

  }

`;


const MainTable = styled.div`
  width: 200%; /* Adjust the width for mobile screens */
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
const id = new URLSearchParams(window.location.search).get('id');

const userDataRef = ref(database, `comments/`);

const ITEMS_PER_PAGE = 10;

const AuditedProjects: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [userData, setUserData] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true); // Add this line for loading state
    const [pairData, setPairData] = useState<PairData | null>(null);
    const [pairDataList, setPairDataList] = useState<PairData[]>([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [id, setId] = useState<string | null>(null);



    useEffect(() => {
      // Function to fetch userData from Firebase
      const fetchUserData = () => {
        // Use the id state here
        const userDataRef = id ? ref(database, `comments/${id}`) : null;
  
        if (userDataRef) {
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
          });
        }
      };
  
      // Fetch userData initially
      fetchUserData();
  
      // Set up interval to fetch userData every 10 seconds
      const intervalId = setInterval(() => {
        fetchUserData();
      }, 10000);
  
      // Clean up the interval on component unmount
      return () => clearInterval(intervalId);
    }, [searchTerm, id]);
  
    useEffect(() => {
      // Fetch 'id' from the URL every 10 seconds
      const fetchId = () => {
        const newId = new URLSearchParams(window.location.search).get('id');
        setId(newId);
      };
  
      // Fetch 'id' initially
      fetchId();
  
      // Set up interval to fetch 'id' every 10 seconds
      const idIntervalId = setInterval(() => {
        fetchId();
      }, 10000);
  
      // Clean up the interval on component unmount
      return () => clearInterval(idIntervalId);
    }, []);

  
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
      
        // Now you can use the 'formattedTime' variable wherever needed in your component.
        // For example, in the JSX for rendering:
    
        
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
    <TableRow>
      <TableData colSpan={4} style={{ textAlign: 'center',height:'100px' }}>
        No Comments Found
      </TableData>
    </TableRow>
  );

// Existing code...

const createTableRow = (user: any, index: number) => (
  <TableRow key={user.userId || index} style={{ cursor: 'pointer' }}>
      <TableData>
        <div className='finalview'>
          <div className='avatar'>
        <img src={Comment} width='30' />
       
        <span>{user.pdf.slice(0, 5)}...{user.pdf.slice(user.pdf.length - 5)}</span>
        
        <p 
  style={{backgroundColor:'transparent',fontSize:8}}
  title={user.status}
>
  {formatDistanceToNow(new Date(user.status), { addSuffix: false })}
</p>
        <p style={{ backgroundColor: user.commentType === 'Bullish' ? 'green' : 'red' }}>{user.commentType}</p>
        </div>
         <span>{user.name}</span>
         <a href={user.logoPicture} target='_blank'> <img
          src={user.logoPicture}
          width='30%'
         
          style={{ cursor: 'pointer' }}
        />   </a>  </div>
         </TableData>   
        
  </TableRow>
);

// Existing code...

  const redirectToReport = (userId: string) => {
    const encodedName = encodeURIComponent(userId);
    window.location.href = `kycproject.html?name=${encodedName}`;
  };


  


  return (
    <Section>
      <Container>
     
 
        <Header>
        <div className="comment-head">
              <h5>Comments</h5>
            </div>

  

        </Header>
        
      </Container>
  
      <div style={{display:'flex',justifyContent:'center'}}>
<MainTable>
      {loading ? ( // Conditional rendering based on loading state
      <LoaderContainer>
        <p>Loading...</p>
      </LoaderContainer>
    ) : (
      <div className="tablescroll">
      <Table>
      
        <tbody>
              { (
                displayedUserData.map((user, index) => createTableRow(user, index))
                )}
            </tbody>
      </Table>
      </div>
      )}
    
      </MainTable>
      </div>
      
    </Section>
  );
};

export default AuditedProjects;
