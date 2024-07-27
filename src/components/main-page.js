"use client";
import React from "react";
import Header from "./header";
import Navbar from "./navbar";
import { Overview } from "./overview";
import { RecentActivities } from "./recent-acticities";
import { useWallets } from "@privy-io/react-auth";

const MainPage = () => {
  const { wallets } = useWallets();
  const w0 = wallets[0];
  return (
    <div>
      {w0 && (
        <>
          <Header w0={w0} />
          <Navbar />
          <Overview w0={w0} />
          <RecentActivities w0={w0} />
        </>
      )}
    </div>
  );
};

export default MainPage;
