import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { EthereumClient } from "@web3modal/ethereum";
import "./index.scss";
import App from "./App";
import { chains, projectId, wagmiConfig } from "./utils/Connectors/Connectors";
import { WagmiConfig } from "wagmi";
import { Web3Modal } from "@web3modal/react";
import { ToastProvider } from 'react-toast-notifications';

const ethereumClient = new EthereumClient(wagmiConfig, chains);

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <WagmiConfig config={wagmiConfig}>
      <ToastProvider>

        <App />
        </ToastProvider>

      </WagmiConfig>
      <Web3Modal
        themeVariables={{
          "--w3m-accent-color": "#ffba00",
          "--w3m-button-border-radius": "32px",
          "--w3m-text-medium-regular-size": "14px",
          "--w3m-wallet-icon-border-radius": "5px",
        }}
        projectId={projectId}
        ethereumClient={ethereumClient}
      />
    </BrowserRouter>
  </React.StrictMode>
);
