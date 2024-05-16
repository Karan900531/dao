import { useState, useEffect } from 'react';
import Logo from "../assets/images/8bit-logo-text.png"
import Busd from "../assets/images/output-onlinepngtools (2).png"
import { useAccount, useChainId } from "wagmi";
import { Link, useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";

import './stakin.scss'; // Assuming you have styles in a separate CSS file

export default function Card() {
    const { address } = useAccount();

    const [acc, setAcc] = useState(address || '');

    useEffect(() => {
        setAcc(address || '');
    }, [address]);


    const Card = styled.div`
    @import url('https://fonts.googleapis.com/css?family=Space+Mono:400,400i,700,700i');


    .title {
      margin-bottom: 30px;
      color: #162969;
    }
    
    .card {
      width: 320px;
      height: 190px;
      -webkit-perspective: 600px;
      -moz-perspective: 600px;
      perspective: 600px;
      @media (max-width: 768px) {
        width: 100%;
    
      }
    }
    
    .card__part {
      box-shadow: 3px 3px var(--q-primaryBg);
      top: 0;
      position: absolute;
      z-index: 1000;
      left: 0;
      display: inline-block;
      width: 320px;
      height: 190px;
      background-image: url('../assets/images/footer-bg.png'),
        linear-gradient(
          to right bottom,
          #fdce69,
          #fac761,
          #f6d458,
          #f1a950,
          #eca548
        ); /*linear-gradient(to right bottom, #fd8369, #fc7870, #f96e78, #f56581, #ee5d8a)*/
      background-repeat: no-repeat;
      background-position: center;
      background-size: cover;
      border-radius: 8px;
      @media (max-width: 768px) {
        width: 100%;
    
      }
      -webkit-transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      -moz-transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      -ms-transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      -o-transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      -webkit-transform-style: preserve-3d;
      -moz-transform-style: preserve-3d;
      -webkit-backface-visibility: hidden;
      -moz-backface-visibility: hidden;
    
      transform-style: preserve-3d;
      backface-visibility: hidden;
    }
    
    .card__front {
      padding: 18px;
      -webkit-transform: rotateY(0);
      -moz-transform: rotateY(0);
    
      transform: rotateY(0);
    }
    
    .card__back {
      padding: 18px 0;
      -webkit-transform: rotateY(-180deg);
      -moz-transform: rotateY(-180deg);
      transform: rotateY(-180deg);
    }
    
    .card__black-line {
      margin-top: 5px;
      height: 38px;
      background-color: #303030;
    }
    
    .card__logo {
      height: 32px;
      filter: grayscale(1) contrast(100) brightness(1);
    }
    
    .card__front-logo {
      position: absolute;
      top: 18px;
      right: 18px;
    }
    .card__square {
      filter: grayscale(1) contrast(100) brightness(1);
      border-radius: 5px;
      height: 30px;
    }
    
    .card_numer {
      display: block;
      width: 100%;
      word-spacing: 8px;
      font-size: 23px;
      letter-spacing: 2px;
      color: #fff;
      text-align: left;
      margin-bottom: 20px;
      margin-top: 20px;
    }
    
    @media (max-width: 768px) {
      .card_numer {
        font-size: 18px;
      }
    }
    
    .card__space-75 {
      width: 75%;
      float: left;
    }
    
    .card__space-25 {
      width: 25%;
      float: left;
    }
    
    .card__label {
      font-size: 10px;
      text-transform: uppercase;
      color: rgba(255, 255, 255, 0.8);
      letter-spacing: 1px;
    }
    
    .card__info {
      margin-bottom: 0;
      margin-top: 5px;
      font-size: 16px;
      line-height: 18px;
      color: #fff;
      letter-spacing: 1px;
      text-transform: uppercase;
    }
    
    .card__back-content {
      padding: 15px 15px 0;
    }
    .card__secret--last {
      color: #303030;
      text-align: right;
      margin: 0;
      font-size: 14px;
    }
    
    .card__secret {
      padding: 5px 12px;
      background-color: #fff;
      position: relative;
    }
    
    .card__secret:before {
      content: '';
      position: absolute;
      top: -3px;
      left: -3px;
      height: calc(100% + 6px);
      width: calc(100% - 42px);
      border-radius: 4px;
      background: repeating-linear-gradient(
        45deg,
        #ededed,
        #ededed 5px,
        #f9f9f9 5px,
        #f9f9f9 10px
      );
    }
    
    .card__back-logo {
      position: absolute;
      bottom: 15px;
      right: 15px;
    }
    
    .card__link {
        position: absolute;
        bottom: 15px;
        font-size: 14px;
    border-radius: 10px;
        padding: 3px 10px ;
        background-color: white;
        color:black;
        left: 15px;
      }
    .card__back-square {
      position: absolute;
      bottom: 15px;
      left: 15px;
    }
    
    .card:hover .card__front {
      -webkit-transform: rotateY(180deg);
      -moz-transform: rotateY(180deg);
      transform: rotateY(180deg);
    }
    
    .card:hover .card__back {
      -webkit-transform: rotateY(0deg);
      -moz-transform: rotateY(0deg);
      transform: rotateY(0deg);
    }
  `;

  return (
    <div className='pad'>

    <div className="card">
      <div className="card__front card__part">
        <img
          className="card__front-square card__square"
          src={Busd}
          alt=""
        />
        <img
          className="card__front-logo card__logo"
          src={Logo}
          alt=""
        />
        <p className="card_numer">
          {acc.substring(0, 2) +
            '** **** **** ' +
            acc.toUpperCase().substring(acc.length - 4, acc.length)}
        </p>
        <div className="card__space-75">
          <span className="card__label">Card holder</span>
          <p className="card__info">
            {acc.substring(0, 2) +
              '** **** **** ' +
              acc.toLowerCase().substring(acc.length - 4, acc.length)}
          </p>
        </div>
        <div className="card__space-25">
          <span className="card__label">Staked to</span>
          <p className="card__info">12/22</p>
        </div>
      </div>

      <div className="card__back card__part">
        <div className="card__black-line"></div>
        <div className="card__back-content">
          <div className="card__secret">
            
            <p className="card__secret--last">420</p>
          </div>
          <img
            className="card__back-square card__square"
            src="~assets/img/chip.png"
            alt=""
          />
          <Link
              className="card__link"
              to="./staking"
            >
              Stake your w8Bit
            </Link>
          <img
            className="card__back-logo card__logo"
            src={Logo}
            alt=""
          />
        </div>
      </div>
      </div>

      <div style={{width:'100%',border:'1px solid var(--search-clr)',marginTop:20,padding:14,borderRadius:8}}>
       <p style={{color:'var(--search-clr)',fontSize:17}}>Available Pools</p> 
       <div style={{width:'100%',border:'1px solid var(--search-clr)',display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:20,padding:10,borderRadius:5}}>
      <div><p style={{color:'var(--search-clr)',fontSize:9}}>Title</p>
      <p style={{color:'white',fontSize:10}}>Special BSC Pool</p> </div> 
      <div><p style={{color:'var(--search-clr)',fontSize:9}}>APY</p>
      <p style={{color:'white',fontSize:10}}>25%</p> </div> 
      <Link to="./stakingpoolone"><div style={{width:20,height:20,display:'flex',cursor:'pointer',borderRadius:'50%',justifyContent:'center',alignItems:'center',border:'1px solid #ffba00',color:'#ffba00'}}>{'>'} </div> </Link>

      </div>
      
      <div style={{width:'100%',border:'1px solid var(--search-clr)',display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:20,padding:10,borderRadius:5}}>
      <div><p style={{color:'var(--search-clr)',fontSize:9}}>Title</p>
      <p style={{color:'white',fontSize:10}}>NFT Holders 2X Pool</p> </div> 
      <div><p style={{color:'var(--search-clr)',fontSize:9}}>APY</p>
      <p style={{color:'white',fontSize:10}}>50%</p> </div> 
      <Link to="./stakingpooltwo"><div style={{width:20,height:20,display:'flex',cursor:'pointer',borderRadius:'50%',justifyContent:'center',alignItems:'center',border:'1px solid #ffba00',color:'#ffba00'}}>{'>'} </div> </Link>

      </div>
      </div>

    </div>
  );
}
