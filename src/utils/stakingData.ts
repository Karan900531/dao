import { IStakingCollection } from "../constants/types";

import architect from "../assets/Collection/architect.jpg";
import earlybird from "../assets/Collection/earlybird.jpg";
import elite from "../assets/Collection/elite.jpg";
import nodeknight from "../assets/Collection/nodeknight.jpg";
import torchbearer from "../assets/Collection/torch.jpg";

export const stakingNftCollections: IStakingCollection[] = [
  {
    name: "Architect",
    countOfNft: 75,
    nftContract: "0x30eEDD9977f5233411e130C45928660594598Ae7",
    stakingAddress: "0xde1df4f0b932f6ad522a2513affa05ee183ab17a",
    image: architect,
    symbol: "8BCAR",
  },
  {
    name: "Early Bird",
    countOfNft: 25,
    nftContract: "0xfaabc49f9866aece14baa0ff797eeca26cd5e351",
    stakingAddress: "0x8d902c7a839aaecd905219aa3b6e91d261c201be",
    image: earlybird,
    symbol: "8BCEB",
  },
  {
    name: "Torch Bearer",
    countOfNft: 75,
    nftContract: "0x87e0919c70fc56bb7ea249a6a2fd6d56d43c7eb3",
    stakingAddress: "0xbb549863b476f9776d9964636132fcbf6e27a780",
    image: torchbearer,
    symbol: "8BCTB",
  },
  {
    name: "Elite",
    countOfNft: 50,
    nftContract: "0x9102f2e78342fe5f8eef17609b54215ca0605ecd",
    stakingAddress: "0x16b2090d4f3d586c2508caebff5afaeaae4cc8da",
    image: elite,
    symbol: "8BCEL",
  },
  {
    name: "Node Knight",
    countOfNft: 275,
    nftContract: "0x7f495e679f4ec7dcd1d1e0e1dd3f6ec967c8e99f",
    stakingAddress: "0xf5618c7dd4cfc5eb7bec7bba57566d9a07de34ac",
    image: nodeknight,
    symbol: "8BCNK",
  },
];
