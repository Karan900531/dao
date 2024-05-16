import React,{useState,useEffect} from "react";
import { HeroData } from "../../data/HeroImgData";
import "./Hero.scss";
import { Link } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { getDatabase, ref, onValue } from 'firebase/database';
import ToggleBtn from "../ToggleBtn";


const Hero: React.FC = () => {
  const [userData, setUserData] = useState<any>({}); // Change 'any' to a more appropriate type
  const [isLoading, setIsLoading] = useState(true);
  const [checked, setChecked] = React.useState(true);
  const [autoplay, setAutoplay] = useState<any>("true");
  const [slidesToShow, setSlidesToShow] = useState<number>(1);
  const [slideGap, setSlideGap] = useState<number>(0);




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
            setAutoplay(isMobile);
            setSlidesToShow(isMobile ? 1 : 4);
            setSlideGap(isMobile ? 0 : 20);

          };
      
          handleResize(); // Call once to set autoplay initially
      
          window.addEventListener('resize', handleResize);
      
          return () => window.removeEventListener('resize', handleResize);
        }, []);
          // Settings for the carousel
          const settings = {
            dots: false,
            arrows: false,
            infinite: true,
            speed: 500,
            slidesToShow: slidesToShow, // Use slidesToShow state here
            slidesToScroll: 1,
            autoplay: autoplay, // Use autoplay state here
            autoplaySpeed: 2000,
            slideGap: slideGap, // Add slideGap property here


            responsive: [
              {
                breakpoint: 768,
                settings: {
                  slidesToShow: 1,
                  slidesToScroll: 1,
                  swipeToSlide: true,
                  adaptiveHeight: true,
                  centerMode: false,
                  variableWidth: false,
                  dots: true,
                  arrows: false,
                  autoplay: true,
                  autoplaySpeed: 2000,
                  infinite: true,
                  speed: 500,
                  mobileFirst: true,
                  dotsClass: 'slick-dots',
         
                },
              },
            ],
            centerMode: false,
            variableWidth: false,
            centerPadding: "0px",
            
            swipeToSlide: true,
            adaptiveHeight: true,
           
            cssEase: "linear",
            focusOnSelect: true,
            pauseOnHover: true,
            pauseOnFocus: true,
          };
        
          if (!autoplay) {
            settings["slideGap"] = slideGap; // Add slideGap property here
          }
          const sliderStyle = {
            width: '100%',
            padding:'0px',
            height:'fir-content',
            margin:0,
            overflow:'hidden',
            marginBottom:-0 // Set the width to 100% or any desired value
          };
  return (
    <div className="hero-wrapper">
      <div className="mx">

       
              <Slider style={sliderStyle} {...settings} >
                <div className="hero-content">
                  <img src={userData.banner1} alt="" />
                </div>
                <div  className="hero-content">
                  <img src={userData.banner2} alt="" />
                </div>
                <div className="hero-content" >
                  <img src={userData.banner3} alt="" />
                </div>
                <div className="hero-content" >
                  <img src={userData.banner4} alt="" />
                </div>
              </Slider>


  
        <div className="dextboard-content flex-item">
          <div className="dextboard flex-item">
            <h1 >EagleEye Insight</h1>
           
           
          </div>
        
        </div>
      </div>
    </div>
  );
};

export default Hero;
