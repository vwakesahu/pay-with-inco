import { Contract } from "ethers";
import { SendButton } from "./sendPopup";
import { ERC20ABI } from "@/contract";
import { getInstance, getSignature } from "@/utils/fhEVM";
import { CoinsIcon, PiggyBankIcon } from "lucide-react";
import { useEffect, useState } from "react";
import Loader from "./loader";
import { RequestButton } from "./requestPopup";
import BurnToken from "./burnPopup";
import { useSelector } from "react-redux";
import WrapToken from "./wrapToken";

const { default: Image } = require("next/image");
const { Button } = require("./ui/button");

export const Overview = ({
  balanceOfDeafaultErc20,
  normalBalanceLoadin,
  normalTokenBalance,
  w0,
  data,
  setData,
  balanceOfEncryptedErc20,
  balance,
  balanceLoading,
}) => {
  return (
    <div className="mt-8 px-8">
      <p className="text-3xl font-semibold">Overview</p>
      <div className="mt-8 p-4 py-6 bg-white rounded-lg flex drop-shadow-sm">
        <Image src={"/icons/hero.svg"} width={305} height={247} />
        <div className="w-full grid grid-cols-2">
          <div className="border-r w-full flex  items-center justify-center">
            <div>
              <div className="flex items-center gap-3">
                <Image src="/icons/lock.svg" width={16} height={16} />
                <p className="font-medium text-[#71737F]">cUSDC Balance</p>
              </div>

              <div>
                {balanceLoading ? (
                  <div className="h-28 grid place-items-center">
                    <Loader />
                  </div>
                ) : (
                  <div className="flex items-center mt-1">
                    <div className="text-7xl font-semibold text-primary">
                      {balance}
                    </div>
                    {/* <div className="text-8xl font-semibold text-primary">$</div> */}
                  </div>
                )}

                <div className="flex items-center gap-4 mt-4">
                  <SendButton
                    balance={balance}
                    w0={w0}
                    data={data}
                    setData={setData}
                    balanceOfEncryptedErc20={balanceOfEncryptedErc20}
                  />
                  <BurnToken
                    data={data}
                    setData={setData}
                    balance={balance}
                    w0={w0}
                    balanceOfEncryptedErc20={balanceOfEncryptedErc20}
                    balanceOfDeafaultErc20={balanceOfDeafaultErc20}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="w-full flex  items-center px-14">
            <div>
              <div className="flex items-center gap-3">
                <Image src="/icons/unlock.svg" width={16} height={16} />
                <p className="font-medium text-[#71737F]">USDC Balance</p>
              </div>

              {normalBalanceLoadin ? (
                <div className="h-28 grid place-items-center">
                  <Loader />
                </div>
              ) : (
                <div className="flex items-center mt-1">
                  <div className="text-7xl font-semibold text-primary">
                    {normalTokenBalance}
                  </div>
                  {/* <div className="text-8xl font-semibold text-primary">$</div> */}
                </div>
              )}
              <div>
                <WrapToken
                  w0={w0}
                  setData={setData}
                  balance={normalTokenBalance}
                  balanceOfDeafaultErc20={balanceOfDeafaultErc20}
                  balanceOfEncryptedErc20={balanceOfEncryptedErc20}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
