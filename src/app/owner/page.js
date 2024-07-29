"use client";
import Loader from "@/components/loader";
import Login from "@/components/login";
import OwnerPage from "@/components/owner";
import { usePrivy } from "@privy-io/react-auth";
import React from "react";
import { useSelector } from "react-redux";

const Page = () => {
  const { authenticated, ready } = usePrivy();

  // console.log(erc20ContractAddress);
  if (!ready)
    return (
      <div className="h-screen w-full grid place-items-center">
        <Loader />
      </div>
    );
  return <div>{authenticated ? <OwnerPage /> : <Login />}</div>;
};

export default Page;
