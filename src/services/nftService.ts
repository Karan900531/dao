import axios from "axios";
import { config } from "../constants/config";

export const getUserNfts = async (user: string, collection: string) => {
  const { data } = await axios.post(config.SUBGRAPH_URL, {
    query: `
      query($owner:String!,$collection:String!){
        nfts(where:{owner_:{id:$owner},tokenAddress_:{id:$collection}}){
          id
          tokenId
          tokenUri
        }
      }
      `,
    variables: {
      owner: user.toLowerCase(),
      collection: collection.toLowerCase(),
    },
  });

  if (data["errors"]) {
    return [];
  }

  return data.data.nfts;
};

export const getNftsByTokenIds = async (collection: string, tokenIds: string[]) => {
  const { data } = await axios.post(config.SUBGRAPH_URL, {
    query: `
      query($tokenIds:[String!],$collection:String!){
        collection(id:$collection){
          nfts(where:{tokenId_in:$tokenIds}){
            id
            tokenId
            tokenUri
          }
        }
      }
      `,
    variables: {
      tokenIds: tokenIds,
      collection: collection.trim().toLowerCase(),
    },
  });

  console.log(data);

  if (data["errors"]) {
    return [];
  }

  if (!data.data.collection) return null;

  return data.data.collection.nfts;
};
