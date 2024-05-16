import React, { useState,useEffect } from "react";
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue } from 'firebase/database';
import Logo from "../../assets/images/LogoImg.png";
import DextScore from "../PairExplorerInfo/DextScore"
import millify from "millify";
import { formatDistanceToNow } from 'date-fns';
import { ReactComponent as Telescope } from "../../assets/icons/telescope.svg";
import { ReactComponent as CopyIcon } from "../../assets/icons/copy.svg";
import { ReactComponent as Star } from "../../assets/icons/star.svg";
import { ReactComponent as Forward } from "../../assets/icons/forword.svg";
import { ReactComponent as Laptop } from "../../assets/icons/website.svg";
import { ReactComponent as Telegram } from "../../assets/icons/telegramIcon.svg";
import { ReactComponent as Twitter } from "../../assets/icons/twitterIcon.svg";
import { ReactComponent as Facebook } from "../../assets/icons/facbook.svg";

import "./PairExplorerDetails.scss";
import axios from "axios";
import { Link } from "react-router-dom";
import TradeHistory from "../TradeHistory";
import Holders from "../Holders";
import CandlestickChart from "./Trading";




const PairExplorerDetails = () => {
  const [userData, setUserData] = useState<any>({}); // Change 'any' to a more appropriate type
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false); // State to track if copied


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
          const userDataRef = ref(database, `proposal/${id}`);
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

        const currentTime = new Date(); // Get the current time

        const endDate = new Date(`${userData.dateend}:00`);


        const isExpired = endDate > currentTime;



  return (
    <div className="pariExplorer-container">

      <div className="pairExplorer-details-wrapper">
 
      {userData && (

        <div className="pairExplorer-details-container">
          <div className="first-step">
            <div >
           

            
            </div>
            <div className="dext-tool-content">
              <Link style={{color:'#ffba00',fontSize:14,marginRight:30,cursor:'pointer'}} to="/dao">{"<"} Back</Link>
              <h6>Proposal Details</h6>
              <p className="namings">{userData.name}</p> 
              <p className="namingsr">{userData.overview}</p> 
              <p style={{marginTop:30,fontSize:17,color:'white'}}>Details :</p> 

              <p className="namingsr soro">{userData.desc}</p> 

             

              

            
             
            </div>
          </div>
         
        </div>
        )}
      </div>
    <div className="pairExplorer-details-wrapper">
      {isExpired ? (
            <>
          <DextScore id={userData.userId} allowInteraction={true} />
        

<p><p style={{marginBottom:10}}>Time Left to Vote :  <span style={{color:'white'}}>{formatDistanceToNow(new Date(endDate), { addSuffix: false })}</span>
</p></p></>
          ) : (
            <>
            <DextScore id={userData.userId} allowInteraction={false} />
            <p><p style={{marginBottom:10}}>Time Left to Vote :  <span style={{color:'white'}}>None</span>

</p></p>
          
         </>            )}</div>
            
    </div>
  );
};

export default PairExplorerDetails;
