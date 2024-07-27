"use client";
import Loader from "@/components/loader";
import Login from "@/components/login";
import MainPage from "@/components/main-page";
import { usePrivy } from "@privy-io/react-auth";
import React from "react";

const Page = () => {
  const { authenticated, ready } = usePrivy();
  if (!ready)
    return (
      <div className="h-screen w-full grid place-items-center">
        <Loader />
      </div>
    );
  return <div>{authenticated ? <MainPage /> : <Login />}</div>;
};

export default Page;
