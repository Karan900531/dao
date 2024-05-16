import React from "react";

export default function Restake() {
  return (
    <div>
      <div className="stake_box p-3 mt-3">
        <div>
          <div className="d-flex flex-column stake_amount_details">
            <label>Earned Reward:</label>

            <label>
              <i className="fa-solid fa-landmark-dome"></i>
              2000
            </label>
          </div>

          <div className="d-flex flex-column  mt-3">
            <label>Restake Amount</label>

            <div className="unstake_amount mt-3">
              <input type="text" value="0" />

              <button>Max</button>
            </div>
          </div>

          <div className="d-flex align-items-center justify-content-between mt-3">
            <div className="tokens_stake_details">
              <button>
                <i className="fa-solid fa-landmark-dome"></i>
                Restake
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
