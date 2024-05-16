import React, { useCallback, useEffect, useState } from "react";
import { getUserNfts } from "../services/nftService";
import { INft } from "../constants/types";
import { useAccount } from "wagmi";

type IProps = { pageSize?: number; collection: string };

export function useGetUserNfts({ pageSize = 100, collection }: IProps) {
  const [data, setData] = useState<INft[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const { address } = useAccount();

  const handleGetData = useCallback(async () => {
    try {
      if (!address) return;
      const data = await getUserNfts(address.toLowerCase(), collection.toLowerCase());

      console.log(data);
      setData(data);
    } catch (error) {
      console.log(error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, [address, collection]);

  useEffect(() => {
    handleGetData();
  }, [handleGetData]);

  return { isLoading, isError, data };
}
