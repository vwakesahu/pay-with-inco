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

const { default: Image } = require("next/image");
const { Button } = require("./ui/button");

export const Overview = ({ w0, data, setData }) => {
  const {
    erc20ContractAddress: { erc20ContractAddress },
  } = useSelector((state) => state);
  const [balanceLoading, setBalanceLoading] = useState(false);
  const [balance, setBalance] = useState("0");
  const balanceOfEncryptedErc20 = async () => {
    setBalanceLoading(true);
    try {
      const provider = await w0?.getEthersProvider();
      const signer = await provider?.getSigner();
      const encryptedERC20 = new Contract(
        erc20ContractAddress,
        ERC20ABI,
        signer
      );
      const fhevmInstance = await getInstance();
      console.log(fhevmInstance);
      const token = await getSignature(
        erc20ContractAddress,
        w0.address,
        fhevmInstance
      );
      const balance = await encryptedERC20.balanceOf(
        token.publicKey,
        token.signature,
        w0.address
      );
      // console.log(balance);
      const decrytedBalance = await fhevmInstance
        .decrypt(erc20ContractAddress, balance.toString())
        .toString();

      setBalance(decrytedBalance);
      setBalanceLoading(false);
    } catch (error) {
      setBalanceLoading(false);
      console.log(error);
    }
  };
  useEffect(() => {
    balanceOfEncryptedErc20();
  }, [w0]);

  return (
    <div className="mt-8 px-8">
      <p className="text-4xl font-semibold">Overview</p>
      <div className="mt-8 p-4 py-6 bg-white rounded-lg flex drop-shadow-sm">
        <Image src={"/icons/hero.svg"} width={305} height={247} />
        <div className="w-full grid grid-cols-3">
          <div className="border-r w-full flex  items-center justify-center">
            <div>
              <div className="flex items-center gap-3">
                <p className="text-lg font-medium text-[#71737F]">
                  Total Balance:
                </p>
                <CoinsIcon onClick={balanceOfEncryptedErc20} />
              </div>

              <div>
                {balanceLoading ? (
                  <div className="h-28 grid place-items-center">
                    <Loader />
                  </div>
                ) : (
                  <div className="flex items-center">
                    <div className="text-8xl font-semibold text-primary">
                      {balance}
                    </div>
                    <div className="text-8xl font-semibold text-primary">$</div>
                  </div>
                )}

                <SendButton
                  w0={w0}
                  data={data}
                  setData={setData}
                  balanceOfEncryptedErc20={balanceOfEncryptedErc20}
                />
              </div>
            </div>
          </div>
          <div className="border-r w-full flex  items-center justify-center">
            <div>
              <p className="text-xl font-medium">Request</p>
              <div>
                {/* <p className="max-w-72 font-medium text-[#71737F]">
                  lorem isumlorem isumlorem isumlorem isum
                </p> */}
                <div className="h-20"></div>

                <RequestButton
                  w0={w0}
                  balanceOfEncryptedErc20={balanceOfEncryptedErc20}
                />
              </div>
            </div>
          </div>

          <div className="w-full flex  items-center justify-center">
            <div>
              <p className="text-xl font-medium">Burn</p>
              <div>
                {/* <p className="max-w-72 font-medium text-[#71737F]">
                  lorem isumlorem isumlorem isumlorem isum
                </p> */}
                <div className="h-20"></div>

                <BurnToken
                  data={data}
                  setData={setData}
                  balance={balance}
                  w0={w0}
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
