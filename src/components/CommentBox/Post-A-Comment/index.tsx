import React, { useState , useEffect} from 'react';
import * as Yup from 'yup';
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import { ReactComponent as FileTextIcon } from '../../../assets/icons/file-text.svg';
import './PostAComment.scss';
import { format } from 'date-fns'; // Import date-fns for date formatting
import 'react-datepicker/dist/react-datepicker.css'
import { addComment } from '../../../utils/commentService';
import { useWeb3Modal } from '@web3modal/react';
import { useAccount } from 'wagmi';
import { NFTS } from "../../../utils/address";
import { MaxUint256, ethers, formatEther, parseEther } from "ethers";
import {fetchNFTHoldingsForAddress,getSigner} from "../../../utils/nft"
import firebase from 'firebase/app';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref as dataRef, push, set, Database } from 'firebase/database';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL, FirebaseStorage } from 'firebase/storage';
import { useToasts } from 'react-toast-notifications';

// ... rest of your code

interface PopupProps {
  onClosure: () => void;
}
const PostAComment: React.FC<PopupProps> = ({ onClosure }) => {
  const { open } = useWeb3Modal();
  const { address } = useAccount();
  const [imageFile, setImageFile] = useState<File | null>(null);
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


  const handleSubmit = async (values: any, actions: FormikHelpers<any>) => {
    try {
      if (!address)         return addToast("Connect Wallet", { appearance: 'error', autoDismiss: true, autoDismissTimeout: 2000 });

      if (Object.values(nftHoldings).reduce((acc, holdings) => acc + parseFloat(holdings), 0) <= 0) {
        return addToast("you don,t have any 8Bit Chain NFTs", { appearance: 'error', autoDismiss: true, autoDismissTimeout: 2000 });
      }
      const name = values.comment;

      const overview = values.overview;
      const dateend = values.dateTime;
      const desc = values.desc;
      const whom = address === '0x05Ec40277Bd8246D1A79D26e44BcB00fde8C7A38' ? 'Team' : 'Community';

      const provider = await getSigner(address);
      const message = `Submit ${name} Proposal`; 
      let signature;

      try {
        signature = await provider.signMessage(message);
      } catch (error) {
        console.error("Error signing message:", error);
        return addToast("Signature Failed", { appearance: 'error', autoDismiss: true, autoDismissTimeout: 2000 });
        return; // Prevent form submission if signature is rejected
      }  
  
      // Show "Sending..." message after 2 seconds
      setTimeout(() => {
        actions.setSubmitting(true);
      }, 2000);
  
      const docId = "example-document-id"; // Replace with your logic for generating the docId
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
        
      // Initialize Firebase
      const app = initializeApp(firebaseConfig);
      const database: Database = getDatabase(initializeApp(firebaseConfig));
      const storage: FirebaseStorage = getStorage(app);
      const currentDate = new Date();
      const status = currentDate.toISOString();
      const userAddress = address;
  
      // Push user data to the Realtime Database
      const newUserRef = push(dataRef(database, `proposal/`));
      const userKey = newUserRef.key;
  
      // Upload image to Firebase Storage
  
      const userData = {
        name,
        status,
        whom,
        overview,
        dateend,
        desc,
        userAddress,
        userId: userKey,
     
      };
  
      // Push user data to the Realtime Database
      set(newUserRef, userData);
  
      // Reset form fields and submitting state after 2 seconds
      setTimeout(() => {
        actions.resetForm();
        addToast("Proposal Submitted Successfully", { appearance: 'success', autoDismiss: true, autoDismissTimeout: 2000 });
        actions.setSubmitting(false);
        setImageFile(null);
      }, 2000);
    } catch (error) {
      console.log(error);
    }
  };
  

  return (
    <Formik
    initialValues={{ comment: "", overview: "",                dateTime: new Date().toISOString().slice(0, 16), // Set default value to current date and time

    desc: "", type: "bullish" }}
    validationSchema={Yup.object({
        comment: Yup.string().required("This field is required"),
        overview: Yup.string().required("This field is required"),
        dateTime: Yup.date().required("This field is required"),
        desc: Yup.string().required("This field is required"),
      })}
      onSubmit={handleSubmit}
    >
      {({ values, setFieldValue, isSubmitting }) => (
        <Form>
          <div className="post-a-comment-wrapper">
         

            <div className="comment-content">
            <label>
                 Proposal Title
                </label>
              <div>
                <Field name="comment" type="text" placeholder="Enter Here..." />
                <ErrorMessage name="comment" component="div" className="error-input" />
              </div>

              <div>
              <label>
                  Proposal Overview
                </label>
                <Field name="overview" type="text" placeholder="Enter Here..." />
                <ErrorMessage name="overview" component="div" className="error-input" />
              </div>

              <div>
                <label>
                  End Time
                </label>
                <input
                  type="datetime-local"
                  name="dateTime"
                  className='ggo white-icon' // Add a custom class here
                  value={values.dateTime}
                  onChange={(e) => setFieldValue("dateTime", e.target.value)}
                  placeholder="End Date and Time"
                />
                <ErrorMessage name="dateTime" component="div" className="error-input" />
              </div>


              <div>
              <label>
                  Proposal Description
                </label>
                <Field name="desc" as="textarea" placeholder="Enter Here..." />
                <ErrorMessage name="desc" component="div" className="error-input" />
              </div>
           

              <div className="comment-btn flex-item">
                {!address ? (
                  <button type="button" onClick={() => { open(); onClosure(); }}>
                    Connect Wallet
                  </button>
                ) : (
                  <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Submit"}
                  </button>
                )}
              </div>
            </div>
          </div>
          
        </Form>

      )}
      
    </Formik>
  );
};

export default PostAComment;
