import React, { useEffect, useState } from "react";
import { ReactComponent as Infoicon } from "../../../assets/icons/infoIcon.svg";
import { ReactComponent as InfoIcon } from "../../../assets/icons/info.svg";
// import { ReactComponent as SpeedIcon } from "../../../assets/icons/speed.svg";
import { ReactComponent as MintIcon } from "../../../assets/icons/mint.svg";
import { ReactComponent as LockIcon } from "../../../assets/icons/lock.svg";
import {fetchNFTHoldingsForAddress,getSigner} from "../../../utils/nft"
import { NFTS } from "../../../utils/address";
import { useToasts } from 'react-toast-notifications';
import ProgressBar from "@ramonak/react-progress-bar";
import { ReactComponent as ShareIcon } from "../../../assets/icons/shareIcon.svg";
import { ReactComponent as FeesIcon } from "../../../assets/icons/fees.svg";
import { ReactComponent as ChevronDownIcon } from "../../../assets/icons/chevron-down.svg";
import { ReactComponent as TopArrowIcon } from "../../../assets/icons/topArrow.svg";
import { ReactComponent as ForwardIcon } from "../../../assets/icons/Forward.svg";
import { ReactComponent as ThumbUpHandIcon } from "../../../assets/icons/thumbUpHand.svg";
import { ReactComponent as Tick } from "../../../assets/icons/tick.svg";
import { ReactComponent as Cross } from "../../../assets/icons/close.svg";

import { ReactComponent as RoundedFlatIcon } from "../../../assets/icons/roundedFlatIcon.svg";
import GoPlusImg from "../../../assets/images/goplus.png";
import { GoPlusSecurity } from "../../../data/goPlusSecurity";
import "./DextScore.scss";
import { initializeApp } from 'firebase/app';
import { getDatabase, ref as dataRef, push, set, Database } from 'firebase/database';

import { get, ref, onValue } from 'firebase/database';
import axios from "axios"; 

import { useAccount } from "wagmi";

interface PairData {
  is_honeypot:number;
  is_mintable:number;
  is_proxy:number;
dex:[{
  pair:string;
}]
  buy_tax:number;
  sell_tax:number;
  code: number;
  message:string;
  
}

const DextScore: React.FC<{ id: string, allowInteraction: boolean }> = ({ id, allowInteraction }) => {
  const [showMoreInfo, setShowMoreInfo] = useState<boolean>(false);
  const { addToast } = useToasts();

  const [isContractVerified, setIsContractVerified] = useState<boolean>(false);
  const [isHoney, setHoney] = useState<boolean>(false);
  const [isMint, setMint] = useState<boolean>(false);
  const [userData, setUserData] = useState<any>({}); // Change 'any' to a more appropriate type
  const [isLoading, setIsLoading] = useState(true);
  const [isProxy, setProxy] = useState<boolean>(false);
  const [token, setToken] = useState<string>("");
  const [pair, setPair] = useState<string>("");
  const { address } = useAccount();

  const [nftHoldings, setNFTHoldings] = useState<Record<string, string>>({});

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


  const [goPlusSecurityDetails, setGoPlusSecurityDetails] = useState<PairData | null>(null);
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
          const userDataRef = ref(database, `projects/${id}`);
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
    const fetchGoPlusSecurityDetails = async (userData: any) => {
      try {
        if (userData.pairAddress && userData.chain) {
        const token = userData.contract
        setToken(userData.contract)
        setPair(userData.pairAddress)

        const chain = userData.chain
        const chainId = chain === "bsc" ? 56 : chain === "eth" ? 1 : undefined;

        if (chainId === undefined) {
          console.error("Invalid chain value");
          return;
        }

        const apiUrl = `https://api.gopluslabs.io/api/v1/token_security/${chainId}?contract_addresses=${token}`;
        
        const response = await axios.get(apiUrl);
        const tokenSecurityDetails = response.data.result[Object.keys(response.data.result)[0]];
        setGoPlusSecurityDetails(tokenSecurityDetails);



        setIsContractVerified(response.data.code === 1);
        setHoney(response.data.is_honeypot === "1");
        setMint(response.data.is_mintable === "1");
        setProxy(response.data.is_proxy === "1");
      } else {
        console.error("Pair address or chain is undefined");
      }
      
      } catch (error) {
        console.error("Error fetching GoPlusSecurity details:", error);
      }
    };


    fetchGoPlusSecurityDetails(userData);
  }, [userData]);



  const toggleInfoDisplay = () => {
    setShowMoreInfo((prevShowMoreInfo) => !prevShowMoreInfo);
  };

  const calculateProScore = (): number => {
    let proScore = 0;

    // Check if the contract is verified
    if (isContractVerified) {
      proScore += 36;
    }

    // Check if it's not a honeypot
    if (!isHoney) {
      proScore += 22;
    }
  else{
    proScore -= 12;

  }

    
    // Check if it's not a proxy
    if (!isProxy) {
      proScore += 15;
    }
    else{
      proScore -= 7;
  
    }
    

    // Add score based on the buy tax value if goPlusSecurityDetails is not null
    if (goPlusSecurityDetails && goPlusSecurityDetails.buy_tax !== undefined) {
      proScore -= Math.max(0, ((goPlusSecurityDetails.buy_tax*100) - 1) * 2);
    }

    // Subtract score based on the sell tax value if goPlusSecurityDetails is not null
    if (goPlusSecurityDetails && goPlusSecurityDetails.sell_tax !== undefined) {
      proScore -= Math.max(0, ((goPlusSecurityDetails.sell_tax*100) - 1) * 2);
    }



    if (
      goPlusSecurityDetails &&
      (goPlusSecurityDetails.buy_tax === 0 || goPlusSecurityDetails.sell_tax === 0)
    ) {
      proScore += 8;
    }

    if (!isMint) {
      proScore += 13;
    }
    else{
      proScore -= 7;
  
    }

    return proScore;
  };

  const proScore = calculateProScore();

  const [likes, setLikes] = useState<number>(0);
  const [unlikes, setUnlikes] = useState<number>(0);
  const [hasLiked, setHasLiked] = useState<boolean>(false);
  const [hasUnliked, setHasUnliked] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);

  // ... (existing code)

  useEffect(() => {
    // Fetch likes and unlikes from the database
    const likesRef = ref(database, `likes/${id}/likes`);
    const unlikesRef = ref(database, `likes/${id}/unlikes`);

    onValue(likesRef, (snapshot) => {
      const likesData = snapshot.val();
      setLikes(likesData || 0);
    });

    onValue(unlikesRef, (snapshot) => {
      const unlikesData = snapshot.val();
      setUnlikes(unlikesData || 0);
    });

    // Check if the current user has liked or unliked the item
    if (address) {
      setUserId(address);

      const userLikeRef = ref(database, `likes/${id}/users/${address}/like`);
      const userUnlikeRef = ref(database, `likes/${id}/users/${address}/unlike`);

      onValue(userLikeRef, (snapshot) => {
        setHasLiked(snapshot.exists());
      });

      onValue(userUnlikeRef, (snapshot) => {
        setHasUnliked(snapshot.exists());
      });
    }
  }, [address, id]);


  // Function to handle like
  const handleLike = async () => {
    try {
      
      if (!userId) {
        return addToast("Connect Wallet to Vote", { appearance: 'error', autoDismiss: true, autoDismissTimeout: 2000 });
      }
      if (Object.values(nftHoldings).reduce((acc, holdings) => acc + parseFloat(holdings), 0) <= 0) {
        return addToast("You don't have any 8Bit Chain NFTs", { appearance: 'error', autoDismiss: true, autoDismissTimeout: 2000 });




      }
      // Check if the user has already liked
      if (hasLiked) {
        return addToast("You have already voted", { appearance: 'error', autoDismiss: true, autoDismissTimeout: 2000 });
      }

      if (hasUnliked) {
        return addToast("You have already voted", { appearance: 'error', autoDismiss: true, autoDismissTimeout: 2000 });
      }

      const provider = await getSigner(address);
      const message = `You are Voting For`; 
      let signature;

      try {
        signature = await provider.signMessage(message);
      } catch (error) {
        console.error("Error signing message:", error);
        return addToast("Signature Failed", { appearance: 'error', autoDismiss: true, autoDismissTimeout: 2000 });
        return; // Prevent form submission if signature is rejected
      }  
      // Like
      setLikes((prevLikes) => prevLikes + 1);
      setHasLiked(true);
      // Add the like to the database
      await set(ref(database, `likes/${id}/users/${userId}/like`), true);
      // Update the total likes in the database
      await set(ref(database, `likes/${id}/likes`), likes + 1);

      // If the user has previously unliked, remove the unlike data
      if (hasUnliked) {
        await set(ref(database, `likes/${id}/users/${userId}/unlike`), null);
        setUnlikes((prevUnlikes) => prevUnlikes - 1);
      }
    
  
    } catch (error) {
      console.log(error);
    }
  };

  // Function to handle unlike
  const handleUnlike = async () => {
    try {
      if (!userId) {
        return addToast("Connect Wallet to Vote", { appearance: 'error', autoDismiss: true, autoDismissTimeout: 2000 });
      }
      if (Object.values(nftHoldings).reduce((acc, holdings) => acc + parseFloat(holdings), 0) <= 0) {
        return addToast("You don't have any 8Bit Chain NFTs", { appearance: 'error', autoDismiss: true, autoDismissTimeout: 2000 });




      }
      // Check if the user has already liked
      if (hasLiked) {
        return addToast("You have already voted", { appearance: 'error', autoDismiss: true, autoDismissTimeout: 2000 });
      }

      if (hasUnliked) {
        return addToast("You have already voted", { appearance: 'error', autoDismiss: true, autoDismissTimeout: 2000 });
      }
      const provider = await getSigner(address);
      const message = `You are Voting Against`; 
      let signature;

      try {
        signature = await provider.signMessage(message);
      } catch (error) {
        console.error("Error signing message:", error);
        return addToast("Signature Failed", { appearance: 'error', autoDismiss: true, autoDismissTimeout: 2000 });
        return; // Prevent form submission if signature is rejected
      }  
  
      // Unlike
      setUnlikes((prevUnlikes) => prevUnlikes + 1);
      setHasUnliked(true);
      // Add the unlike to the database
      await set(ref(database, `likes/${id}/users/${userId}/unlike`), true);
      // Update the total unlikes in the database
      await set(ref(database, `likes/${id}/unlikes`), unlikes + 1);

      // If the user has previously liked, remove the like data
      if (hasLiked) {
        await set(ref(database, `likes/${id}/users/${userId}/like`), null);
        setLikes((prevLikes) => prevLikes - 1);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const isApproved = likes > unlikes;

  return (
    <div className="dextScore-wrapper">
      <div className="dext-score">
        {/* <div className="score">
          <SpeedIcon />
          <span>--</span>
        </div> */}
       
       
     
   
     


        <div>
<div style={{display:'flex',width:'100%',justifyContent:'space-between'}}>
 <p style={{fontSize:12}}>Votes For :<span style={{color:'#ffba00'}}> {likes}</span></p>               <p style={{fontSize:12}}>{(likes * 100 / (likes + unlikes)).toFixed(2)}%</p>

</div>
<div style={{marginTop:10}}>
<ProgressBar
  completed={parseFloat((likes * 100 / (likes + unlikes)).toFixed(2))}
  bgColor="var(--green-clr)"
  height="7px" 
  customLabel="." // Set the label text to an empty string to hide it

/>
</div>


        </div>

        
        <div>
<div style={{display:'flex',width:'100%',justifyContent:'space-between',marginTop:15}}>
 <p style={{fontSize:12}}>Votes Against :<span style={{color:'#ffba00'}}> {unlikes}</span></p>               <p style={{fontSize:12}}>{(unlikes * 100 / (likes + unlikes)).toFixed(2)}%</p>

</div>
<div style={{marginTop:10}}>
<ProgressBar
  completed={parseFloat((unlikes * 100 / (likes + unlikes)).toFixed(2))}
  bgColor="rgb(255, 0, 0)"
  height="7px" 
  customLabel="." // Set the label text to an empty string to hide it

/>
</div>

        </div>
        <div className="community-precentage " style={{display:'flex'}}>
        {!allowInteraction && (
  <div className="flexs-item">
   

    {isApproved ? (
       <div
       style={{display:'flex',justifyContent:'center',alignItems:'center',fontSize:14,gap:5,borderRadius:50,border:'0px solid var(--green-clr)',padding:'5px 10px'}}
       className="flexs-item brown-icon"
     >
                 <Tick  style={{color:'var(--green-clr)',width:15}}/>
 
       <p style={{color:'var(--green-clr)',fontSize:14}}>Approved</p>
     </div>
      ) : (
        <div
        style={{display:'flex',justifyContent:'center',alignItems:'center',fontSize:14,gap:5,borderRadius:50,border:'0px solid var(--green-clr)',padding:'5px 10px'}}
        className="flexs-item brown-icon"
      >
                  <Cross  style={{color:'#ea3942',width:15}}/>
  
        <p style={{color:'#ea3942',fontSize:14}}>Rejected</p>
      </div>
      )}
  </div>
)}

{allowInteraction && (
  <>
    {!hasLiked && !hasUnliked && (
      <>
        <div
          style={{display:'flex',justifyContent:'center',alignItems:'center',fontSize:14,gap:5,borderRadius:50,border:'1px solid var(--green-clr)',padding:'5px'}}
          onClick={!hasLiked ? handleLike : undefined}
          className={`flexs-item green-icon ${!allowInteraction && 'disabled'}`}
        >
          <ThumbUpHandIcon style={{margin:' 0px  0  0 10px'}}/>
          <p style={{color:'var(--green-clr)',fontSize:12,marginRight:10}}>Vote For</p>
        </div>

        <div
          style={{display:'flex',marginLeft:5,justifyContent:'center',alignItems:'center',fontSize:14,gap:5,borderRadius:50,border:'1px solid #ea3942',padding:'5px'}}
          onClick={!hasUnliked ? handleUnlike : undefined}
          className="flexs-item brown-icon"
        >
          <RoundedFlatIcon style={{margin:' 0px  0  0 10px'}}/>
          <p style={{color:'#ea3942',fontSize:12,marginRight:10}}>Vote Against</p>
        </div>
      </>
    )}

    {(hasLiked || hasUnliked) && (
      <div className="flexs-item">
        <div
          style={{display:'flex',justifyContent:'center',alignItems:'center',fontSize:14,gap:5,borderRadius:50,border:'1px solid #ffba00',padding:'5px 10px'}}
          className="flexs-item brown-icon"
        >
          <p style={{color:'#ffba00',fontSize:12}}>Already Voted</p>
        </div>
      </div>
    )}
  </>
)}

        
        </div>
        <div className="border-bottom"></div>
     
      </div>
    </div>
  );
};

export default DextScore;
