import { MaxUint256, ethers, formatEther, parseEther } from "ethers";
import router_abi from "./abis/router.json";
import ERC20_abi from "./abis/ERC20Token.json";
import factory_abi from "./abis/factory.json";
import pair_abi from "./abis/pair.json";
import { ROUTER_ADDRESS } from "./address";

function getRouterContract(provider: any, chainId: number) {
  return new ethers.Contract(
    ROUTER_ADDRESS[chainId as keyof typeof ROUTER_ADDRESS],
    router_abi,
    provider
  );
}

function getERC20Contract(provider: any, contractAddress: string) {
  return new ethers.Contract(contractAddress, ERC20_abi, provider);
}

export async function getFactoryContract(provider: any, chainId: number) {
  const router = getRouterContract(provider, chainId);
  const factoryAddress = await router.factory();
  return new ethers.Contract(factoryAddress, factory_abi, provider);
}

export function getPairContract(provider: any, pairAddress: string) {
  return new ethers.Contract(pairAddress, pair_abi, provider);
}

export const swap = async (
  provider: any,
  address: string,
  chainId: number,
  token0: string,
  token1: string,
  swapAmount: string,
  slippage: number
) => {
  const token0ERC20 = getERC20Contract(provider, token0);
  const allowance = formatEther(
    (
      await token0ERC20.allowance(address, ROUTER_ADDRESS[chainId as keyof typeof ROUTER_ADDRESS])
    ).toString()
  );
  const balance = (await token0ERC20.balanceOf(address)).toString();
  const parsedSwapAmount = parseEther(swapAmount).toString();

  if (Number(allowance) < Number(swapAmount)) {
    const approveTx = await token0ERC20.approve(
      ROUTER_ADDRESS[chainId as keyof typeof ROUTER_ADDRESS],
      MaxUint256
    );
    await approveTx.wait();
  }

  if (Number(balance) < Number(parsedSwapAmount)) {
    return new Error("Low balance");
  }

  const router = getRouterContract(provider, chainId);

  const path = [token0, token1];
  console.log(path);

  const amounts = await getAmountOut(provider, parsedSwapAmount, path, chainId);
  console.log(amounts);

  const amount1 = Number(formatEther(amounts[1]));
  const minAmount = amount1 - (Number(slippage) / 100) * amount1;
  const limitMinAmount = minAmount.toFixed(18);

  const swapTx = await router.swapExactTokensForTokens(
    amounts[0],
    parseEther(String(limitMinAmount)),
    path,
    address,
    Date.now() + 1000
  );

  await swapTx.wait();
};

export const swapExactEthToken = async (
  provider: any,
  address: string,
  chainId: number,
  token0: string,
  token1: string,
  swapAmount: string,
  slippage: number
) => {
  const parsedSwapAmount = parseEther(swapAmount).toString();
  const router = getRouterContract(provider, chainId);
  const path = [token0, token1];
  console.log("path", path);

  const amounts = await getAmountOut(provider, parsedSwapAmount, path, chainId);
  const amount1 = Number(formatEther(amounts[1]));
  const minAmount = amount1 - (Number(slippage) / 100) * amount1;
  const limitMinAmount = minAmount.toFixed(18);

  const swapTx = await router.swapExactETHForTokens(
    parseEther(limitMinAmount),
    path,
    address,
    Date.now() + 1000,
    { value: parsedSwapAmount }
  );

  await swapTx.wait();
};

async function getAmountOut(provider: any, amountIn: string, path: string[], chainId: number) {
  const router = getRouterContract(provider, chainId);
  const amounts = await router.getAmountsOut(amountIn, path);
  return amounts;
}

export async function getAmountsOut(
  provider: any,
  from: string,
  to: string,
  amountIn: string,
  chainId: number
) {
  const path = [from, to];
  const amounts = await getAmountOut(provider, amountIn, path, chainId);
  return amounts;
}
