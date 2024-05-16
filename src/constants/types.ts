export interface ILiveData {
  status: "profit" | "loss";
  logo: string;
  tokenName: string;
  symbol: string;
  dollar: number;
  arrow: string;
}

export interface ITokenData {
  id: string;
  title: string;
  logo: string;
  tokenName: string;
}

export interface INft {
  id: string;
  tokenId: string;
  createdAt: string;
  tokenUri: string | null;
}
export interface IPair {
  id: string;
  token0Price: string;
  token1Price: string;
  volumeUSD: string;
  createdAtTimestamp: string;
  untrackedVolumeUSD: string;
  token0: {
    id: string;
    symbol: string;
  };
  token1: {
    id: string;
    symbol: string;
  };
}


export interface IStakingCollection {
  name: string;
  countOfNft: number;
  nftContract: string;
  stakingAddress: string;
  image: string;
  symbol: string;
}