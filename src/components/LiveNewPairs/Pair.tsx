import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import millify from "millify";

import Avatar from "../Avatar";
import ProfileImg from "../../assets/images/LogoImg.png";
import { ReactComponent as CopyIcon } from "../../assets/icons/copy.svg";
// import { ReactComponent as Clock } from "../../assets/icons/clock.svg";
// import { ReactComponent as BinocularIcon } from "../../assets/icons/binocular.svg";
// import { ReactComponent as StartIcon } from "../../assets/icons/star-outline.svg";
// import { ReactComponent as ChartIcon } from "../../assets/icons/chart.svg";
// import { ReactComponent as StarInsertedIcon } from "../../assets/icons/star-inserted.svg";
// import { ReactComponent as LockIcon } from "../../assets/icons/lock.svg";
// import { ReactComponent as ShareIcon } from "../../assets/icons/share.svg";
// import { ReactComponent as MoneyBillIcon } from "../../assets/icons/money-bill.svg";
import { IPair } from "../../constants/types";

const Pair: React.FC<IPair> = ({
  id,
  createdAtTimestamp,
  token0,
  token1,
  token0Price,
  token1Price,
  volumeUSD,
  untrackedVolumeUSD,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <tr
      onClick={() => {
        if (location.pathname.toLowerCase().includes("ethereum")) {
          navigate(`/ethereum/pair-explorer/${id}`);
        } else {
          navigate(`/bnb/pair-explorer/${id}`);
        }
      }}
      style={{ cursor: "pointer" }}
    >
      <td>
        <div className="flex row-header">
          <Avatar profileImage={ProfileImg} tagImage={ProfileImg} />
          <div className="flex-column" style={{ marginLeft: "10px" }}>
            <h4>
              {token0.symbol}-{token1.symbol}
            </h4>
            <div className="copy-address flex-item">
              <p>{`${id.slice(0, 3)}...${id.slice(id.length - 4)}`}</p>
              <CopyIcon width={12} height={12} />
            </div>
          </div>
        </div>
      </td>
      {/* <td
        className="clock-icon"
        style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "5px",
            justifyContent: "center",
          }}
        >
          <Clock width={14} height={14} /> {moment(Number(createdAtTimestamp) * 1000).fromNow()}
        </span>
      </td> */}
      <td>{moment(Number(createdAtTimestamp) * 1000).fromNow()}</td>
      <td style={{ textAlign: "center" }}>
        <span>$ {millify(Number(token1Price), { precision: 3 })}</span>
      </td>
      <td>
        <div className="date-and-time">
          <span>{moment(Number(createdAtTimestamp) * 1000).format("YYYY-MM-DD")}</span>
          <p>{moment(Number(createdAtTimestamp) * 1000).format("hh:mm:ss")}</p>
        </div>
      </td>
      <td style={{ textAlign: "center" }}>
        <span>
          $
          {new Intl.NumberFormat("en-US", { maximumFractionDigits: 4 }).format(
            Number(untrackedVolumeUSD)
          )}
        </span>
      </td>

      <td style={{ textAlign: "center" }}>
        $ {new Intl.NumberFormat("en-US", { maximumFractionDigits: 4 }).format(Number(volumeUSD))}
      </td>
      {/* <td>
        <div className="profit flex-item">
          <p>20.15%</p>
        </div>
      </td>
      <td style={{ textAlign: "center" }}>1.71 ETH</td> */}
      {/* <td>
        <span className="flex flex-start">
          <StarInsertedIcon />
          <LockIcon />
          <ShareIcon />
          <MoneyBillIcon />
        </span>
      </td>

      <td>
        <span className="flex flex-end">
          <BinocularIcon />
          <ChartIcon />
          <StartIcon />
        </span>
      </td> */}
    </tr>
  );
};

export default Pair;
