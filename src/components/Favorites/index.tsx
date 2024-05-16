import React,{useState,useEffect} from "react";
import "./Favorites.scss";
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue } from 'firebase/database';
import { ReactComponent as InfoIcon } from "../../assets/icons/info.svg";
import { ReactComponent as ChartIcon } from "../../assets/icons/chart.svg";
import { ReactComponent as CloseIcon } from "../../assets/icons/close.svg";
import BitChain from "../../assets/images/LogoImg.png";
import Dropdown from "../Dropdown";
import Comment from "../CommentBox/Comment";
import PostAComment from "../CommentBox/Post-A-Comment";

const Favorites = () => {
  const [showFavorites, setShowFavorites] = useState<boolean>(false);
  const [userData, setUserData] = useState<any>({}); // Change 'any' to a more appropriate type
  const [isLoading, setIsLoading] = useState(true);

  


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

  const toggleAdDisplay = () => {
    setShowFavorites((prevShowAd) => !prevShowAd);
  };

  return (
    <div className="favorites-wrapper">

      <img src={userData.banner6} width="100%" style={{marginTop:20,borderRadius:5}} />

      <Comment/>

      {showFavorites && (
        <div className="favorites-container">
          <div className="favorites-wrapper-header" style={{ marginBottom: "15px" }}>
            <p>
              Favorites <InfoIcon />
            </p>
            <div className="flex-item">
              <ChartIcon />
              <span onClick={toggleAdDisplay}>
                <CloseIcon />
              </span>
            </div>
          </div>
          <div style={{ marginBottom: "15px" }}>
            <Dropdown label="Last added" lists={[{ label: "Price" }, { label: "name" }]} />
          </div>
          <div style={{ marginBottom: "15px" }}>
            <Dropdown
              label="All"
              lists={[
                {
                  label: "Ethereum",
                  leftIcon: "https://www.dextools.io/resources/chains/med/ether.png",
                },
                {
                  label: "Binance",
                  leftIcon: "https://www.dextools.io/resources/chains/med/bsc.png",
                },
                {
                  label: "8Bit Chain",
                  leftIcon: BitChain,
                },
              ]}
            />
          </div>
          <p style={{ marginBottom: "15px" }}>Your favorite list is empty!</p>
          <p style={{ marginBottom: "15px" }}>
            Start building your favorite list by adding this pair.
          </p>
        </div>
      )}
    </div>
  );
};

export default Favorites;
