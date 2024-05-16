import React, { useEffect } from "react";
import { useTransactionStore } from "../../store/transactionStore";
import Modal from ".";
import SuccessIcon from "../../Assets/icons/success.svg";
import ErrorIcon from "../../Assets/icons/error.svg";
import CloseIcon from "../../Assets/icons/Cross.svg";

const TransactionModal = () => {
  const transactionStatus = useTransactionStore((store) => store.transactionStatus);
  const setTransactionStatus = useTransactionStore((store) => store.setTransactionStatus);

  useEffect(() => {
    if (transactionStatus?.status === "ERROR") {
      setTimeout(() => {
        setTransactionStatus(null);
      }, 3000);
    }
    if (transactionStatus?.status === "SUCCESS") {
      setTimeout(() => {
        setTransactionStatus(null);
      }, 3000);
    }
  }, [transactionStatus]);

  return transactionStatus ? (
    <Modal isOpen>
      <div className={`transaction-modal ${transactionStatus.status}`}>
        <div className="transaction-modal-header">
          <div></div>
          <h3>{transactionStatus.title}</h3>
          {transactionStatus.status !== "PENDING" && (
            <div className="close-icon" onClick={() => setTransactionStatus(null)}>
              <img src={CloseIcon} alt="" />
            </div>
          )}
        </div>
        <div className="transaction-modal-content">
          <div className={`icon ${transactionStatus.status}`}>
            {transactionStatus.status === "ERROR" ? (
              <img src={ErrorIcon} alt="" />
            ) : transactionStatus.status === "SUCCESS" ? (
              <img src={SuccessIcon} alt="" />
            ) : null}
          </div>
          <p style={{ wordBreak: "break-all" }}>{transactionStatus.message}</p>
        </div>
      </div>
    </Modal>
  ) : null;
};

export default TransactionModal;
