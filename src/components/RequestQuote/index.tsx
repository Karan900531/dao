import React, { useState, useEffect } from 'react';
import "./RequestQuote.css"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ReactComponent as CloseIcon } from "../../assets/icons/close.svg";

import Proposal from "../CommentBox/Post-A-Comment"
const options = [
 
{ value: 'Blockchain', label: 'Blockchain' },
{ value: 'AI', label: 'AI' },
{ value: 'NFT', label: 'NFT' },
{ value: 'DeFi', label: 'DeFi' },
{ value: 'Meme', label: 'Meme' },
{ value: 'Metaverse', label: 'Metaverse' },
];

interface PopupProps {
  onCloses: () => void;
}

const MyComponent:  React.FC<PopupProps> = ({ onCloses }) => {
  const [wordCount, setWordCount] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  useEffect(() => {
    // Update the formData when selectedOption changes
    setFormData({ ...formData, services: selectedOption || '' });
  }, [selectedOption]);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    setSelectedOption(selectedValue);
  };

  const [formData, setFormData] = useState({
    projectname: '',
    ca: '',
    pair: '',
    telegram: '',
    website: '',
    tg: '',
    fb: '',
    exp: '',
    twitter: '',
    logourl: '',
    services: '', // Remove selectedOption here
    description: '',
  });

  const [statusMessage, setStatusMessage] = useState('');

  const handleDescriptionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const description = event.target.value;
    setFormData({ ...formData, description });
    const words = description.split(/\s+/).filter(Boolean);
    setWordCount(words.length);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Validate form fields (you can add your validation logic here)

    // Assuming you have an API endpoint for form submission
    try {
      const response = await fetch('https://formspree.io/f/xbjngqyq', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        toast.success('Listing Request Submitted Successfully! We will contact you soon...', {
          className: 'toast-dark', // Apply the custom dark theme
        });
  
        setFormData({
          projectname: '',
          ca: '',
          pair: '',
          telegram: '',
          website: '',
          tg: '',
          fb: '',
          exp: '',
          twitter: '',
          logourl: '',
          services: '',
          description: '',
        });
      } else {
        toast.error('Failed to submit the form. Please try again later.', {
          className: 'toast-dark', // Apply the custom dark theme
        });
      }
    } catch (error) {
      toast.error('An error occurred while submitting the form.', {
        className: 'toast-dark', // Apply the custom dark theme
      });
      console.error(error);
    }
  };

  const redirectToTelegram = () => {
    const telegramLink = "https://t.me/lovep_8bit";
    window.location.href = telegramLink;
  };

  const sendEmail = () => {
    const emailAddress = "admin@8bitchain.io";
    const mailtoLink = `mailto:${encodeURIComponent(emailAddress)}`;
    window.location.href = mailtoLink;
  };

  return (
    <div>
      <ToastContainer />
      <div className='maino'>
         

        <div className="formo">
          <div style={{display:'flex',justifyContent:'space-between'}}>
            <div> <h2>POST YOUR PROPOSAL</h2>
        <div className="para flex-item">
          <p>
           Post your Proposal at <span style={{color:'#6c89ff'}}>8BIT CHAIN DAPP</span> .
          </p>
        </div></div>
        <div  onClick={onCloses}><CloseIcon style={{color:'white',width:15,cursor:'pointer'}}/></div>
          </div>
       
        
             <Proposal onClosure={onCloses}/>
        </div>
     

      </div>
    </div>
  );
};

export default MyComponent;
