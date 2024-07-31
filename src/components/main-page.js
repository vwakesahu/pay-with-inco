"use client";
import React, { useEffect, useState } from "react";
import Header from "./header";
import Navbar from "./navbar";
import { Overview } from "./overview";
import { RecentActivities } from "./recent-acticities";
import { useWallets } from "@privy-io/react-auth";
import { Contract } from "ethers";
import { useSelector } from "react-redux";
import { ERC20ABI } from "@/contract";
import { getInstance, getSignature } from "@/utils/fhEVM";

const MainPage = () => {
  const { wallets } = useWallets();
  const [data, setData] = useState([]);
  const [balance, setBalance] = useState("0");
  const w0 = wallets[0];
  const [balanceLoading, setBalanceLoading] = useState(false);
  const {
    erc20ContractAddress: { erc20ContractAddress },
  } = useSelector((state) => state);
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
    <div>
      {w0 && (
        <>
          <Header w0={w0} balanceOfEncryptedErc20={balanceOfEncryptedErc20} />
          {/* <Navbar /> */}
          <Overview
            w0={w0}
            data={data}
            setData={setData}
            balanceOfEncryptedErc20={balanceOfEncryptedErc20}
            balance={balance}
            balanceLoading={balanceLoading}
          />
          <RecentActivities w0={w0} data={data} setData={setData} />
        </>
      )}
    </div>
  );
};

export default MainPage;
