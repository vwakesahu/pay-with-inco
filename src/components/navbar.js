"use client";
import { truncateAddress } from "@/utils/truncateAddress";
import { Pencil1Icon, PersonIcon } from "@radix-ui/react-icons";
import axios from "axios";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Input } from "./ui/input";
import { setEncryptedAddress } from "@/redux/slices/userSlice";

const Navbar = () => {
  // const fetchData = async () => {
  //   try {
  //     const { data } = await axios.get(
  //       "https://explorer.testnet.inco.org/api/v2/transactions"
  //     );
  //     console.log(data);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // useEffect(() => {
  //   fetchData();
  // }, []);
  const [isEdit, setIsEdit] = useState(false);
  const {
    erc20ContractAddress: { erc20ContractAddress },
  } = useSelector((state) => state);
  const dispath = useDispatch();
  console.log(erc20ContractAddress)

  return (
    <div className="px-8 flex items-center justify-start gap-4">
      <Item active={true} title={"Overview"} image={"overview"} />
      <Item active={false} title={"Activities"} image={"history"} />
      <div
        className={`p-1 px-2.5 cursor-pointer  flex items-center justify-center gap-2 text-[#71737F] rounded-full`}
      >
        <PersonIcon />
        <input
          value={erc20ContractAddress}
          className="rounded-full p-1 px-2.5"
          onChange={(e) => dispath(setEncryptedAddress(e.target.value))}
        />
        <Pencil1Icon onClick={() => setIsEdit(true)} />
      </div>
    </div>
  );
};

export default Navbar;

const Item = ({ active, title, image }) => {
  return (
    <div
      className={`p-1 px-2.5 cursor-pointer hover:bg-white hover:border flex items-center justify-center gap-2 text-[#71737F] ${
        active ? "border bg-white" : ""
      } rounded-full`}
    >
      <Image src={`/icons/${image}.svg`} width={26} height={26} />
      <p className="font-medium">{title}</p>
    </div>
  );
};
