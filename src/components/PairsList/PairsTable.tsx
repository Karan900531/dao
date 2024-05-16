import React from "react";
import { ReactComponent as InfoIcon } from "../../assets/icons/info.svg";
// import { ReactComponent as BinocularIcon } from "../../assets/icons/binocular.svg";
// import { ReactComponent as StartIcon } from "../../assets/icons/star-outline.svg";
// import { ReactComponent as ChartIcon } from "../../assets/icons/chart.svg";
// import { ReactComponent as SpeedIcon } from "../../assets/icons/speed.svg";
// import { ReactComponent as StarInsertedIcon } from "../../assets/icons/star-inserted.svg";
// import { ReactComponent as LockIcon } from "../../assets/icons/lock.svg";
// import { ReactComponent as ShareIcon } from "../../assets/icons/share.svg";
// import { ReactComponent as MoneyBillIcon } from "../../assets/icons/money-bill.svg";
// import { ReactComponent as CopyIcon } from "../../assets/icons/copy.svg";
// import ProfileImg from "../../assets/images/LogoImg.png";
import { IPair } from "../../constants/types";
import Pair from "../LiveNewPairs/Pair";

const PairsTable: React.FC<{
  data: IPair[];
  setPage: React.Dispatch<React.SetStateAction<number>>;
  page: number;
  loading: boolean;
}> = ({ data, page, setPage, loading }) => {
  return (
    <div>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Pair</th>
              <th>
                <span>
                  Listed Since <InfoIcon />
                </span>
              </th>
              <th>
                <span>
                  Token Price USD <InfoIcon />
                </span>
              </th>
              <th>
                <span>
                  Created At <InfoIcon />
                </span>
              </th>
              <th>
                <span>
                  Untracked Volume <InfoIcon />
                </span>
              </th>
              <th>
                <span>
                  Volume <InfoIcon />
                </span>
              </th>
              {/* <th>
            <span>
              Volume <InfoIcon />
            </span>
          </th>
          <th>
            <span>
              Swaps <InfoIcon />
            </span>
          </th>
          <th>
            <span>
              Liquidity <InfoIcon />
            </span>
          </th>
          <th>
            <span>
              T.M.Cap <InfoIcon />
            </span>
          </th>
          <th>Dex</th>
          <th className="align-right">Actions</th> */}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td align="center" colSpan={6} style={{ lineHeight: "300px" }}>
                  Loading...
                </td>
              </tr>
            ) : (
              data.map((pairList, i) => <Pair key={i.toString()} {...pairList} />)
            )}
          </tbody>
        </table>
      </div>
      <div className="pagination-controls">
        <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
          Prev
        </button>
        <button disabled={data.length < 10} onClick={() => setPage((p) => p + 1)}>
          Next
        </button>
      </div>
    </div>
  );
};

export default PairsTable;
