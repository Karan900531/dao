import { configureChains, createConfig, Chain } from "wagmi";
import { w3mConnectors, w3mProvider } from "@web3modal/ethereum";
import { bsc, mainnet } from "wagmi/chains";

const EightBitChainMainnet: Chain = {
  id: 8088,
  name: "8Bit Chain Mainnet",
  network: "eightbitchainmainnet",
  nativeCurrency: { 
    name: "8Bit Chain", 
    symbol: "8Bit", 
    decimals: 18 
  },
  rpcUrls: {
    default: { http: ["https://rpc.8bitblockchain.com"] },
    public: { http: ["https://rpc.8bitblockchain.com"] },
  },
  blockExplorers: {
    default: { name: "8Bit Chain Mainnet", url: "https://archive.8bitscan.app" },
  },
};

export const chains = [bsc, mainnet];
export const projectId = "4af4492230df1c074def2de12bdbbb0a";

const { publicClient } = configureChains(chains, [w3mProvider({ projectId })]);

export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, chains }),
  publicClient,
});
