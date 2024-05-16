import React from "react";
import UpdateTokenCard from "../UpdateTokenCard";

const data = [
  {
    logo: "https://w7.pngwing.com/pngs/268/1013/png-transparent-ethereum-eth-hd-logo-thumbnail.png",
    name: "TSCAN",
    symbol: "Telescan",
  },
  {
    logo: "https://w7.pngwing.com/pngs/268/1013/png-transparent-ethereum-eth-hd-logo-thumbnail.png",
    name: "TSCAN",
    symbol: "Telescan",
  },
  {
    logo: "https://w7.pngwing.com/pngs/268/1013/png-transparent-ethereum-eth-hd-logo-thumbnail.png",
    name: "TSCAN",
    symbol: "Telescan",
  },
  {
    logo: "https://w7.pngwing.com/pngs/268/1013/png-transparent-ethereum-eth-hd-logo-thumbnail.png",
    name: "TSCAN",
    symbol: "Telescan",
  },
  {
    logo: "https://w7.pngwing.com/pngs/268/1013/png-transparent-ethereum-eth-hd-logo-thumbnail.png",
    name: "TSCAN",
    symbol: "Telescan",
  },
  {
    logo: "https://w7.pngwing.com/pngs/268/1013/png-transparent-ethereum-eth-hd-logo-thumbnail.png",
    name: "TSCAN",
    symbol: "Telescan",
  },
];

const UpdateTokenTable = () => {
  return (
    <div>
      <div className="update-token-wrapper">
        {data.map((d, i) => (
          <UpdateTokenCard key={i.toString()} {...d} />
        ))}
      </div>
    </div>
  );
};

export default UpdateTokenTable;
