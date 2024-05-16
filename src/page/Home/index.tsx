import React, { useEffect, useState } from "react";
import { query, collection, onSnapshot } from "firebase/firestore";
import Hero from "../../components/Hero";


import PairsList from "../../components/PairsList";
import { ITokenData } from "../../constants/types";
import { db } from "../../utils/firebase";

const Home: React.FC = () => {
  const [data, setData] = useState<ITokenData[]>([]);

  useEffect(() => {
    const q = query(collection(db, "insight"));
    onSnapshot(q, (querySnapshot) => {
      setData(
        querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<ITokenData, "id">),
        }))
      );
    });
  }, []);

  return (
     


      <PairsList />
   
  );
};

export default Home;
