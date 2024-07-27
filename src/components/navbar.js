"use client";
import axios from "axios";
import Image from "next/image";
import React, { useEffect } from "react";

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

  return (
    <div className="px-8 flex items-center justify-start gap-4">
      <Item active={true} title={"Overview"} image={"overview"} />
      <Item active={false} title={"Activities"} image={"history"} />
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
