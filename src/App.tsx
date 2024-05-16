import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./page/Home";
import Dashboard from "./page/Dashboard";

import LiveNewPairs from "./components/LiveNewPairs";
import Navigation from "./components/Navigation";
import NFT from "./components/NFT";

import Scam from "./components/Scam";
import Add from "./components/RequestQuote";
import CreatePool from "./components/CreatePool";
import Staking1 from "./components/StakePool1";
import Staking2 from "./components/StakePool2";
import Staking3 from "./components/StakePool3";
import Staking4 from "./components/StakePoolOld1";
import Staking5 from "./components/StakePoolOld2";

import Staking1native from "./components/StakePool1Native";
import Staking2native from "./components/StakePool2Native";
import Staking3native from "./components/StakePool3Native";
import Token from "./components/TokenNew";

import Footer from "./components/Footer";
import Sidebar from "./components/Sidebar";
import PairExplorer from "./page/PairExplorer";

const App: React.FC = () => {
  return (
    <>
      <Navigation />
      <Sidebar />
      <div className="layout-content">

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dao" element={<Home />} />

          <Route path="/proposal-details" element={<PairExplorer />} />
          <Route path="/token-distributor" element={<Token />} />
          <Route path="/nft" element={<NFT />} />
          <Route path="/staking" element={<CreatePool />} />
            <Route path="/staking/One" element={<Staking1 />} />
            <Route path="/staking/Two" element={<Staking2 />} />
            <Route path="/staking/Three" element={<Staking3 />} />
            <Route path="/staking/Four" element={<Staking4 />} />
            <Route path="/staking/Five" element={<Staking5 />} />

            <Route path="/staking/OneNative" element={<Staking1native />} />
            <Route path="/staking/TwoNative" element={<Staking2native />} />
            <Route path="/staking/ThreeNative" element={<Staking3native />} />

        </Routes>
      </div>
      <Footer/>

    </>
  );
};

export default App;
