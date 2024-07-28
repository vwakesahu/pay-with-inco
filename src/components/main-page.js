"use client";
import React, { useState } from "react";
import Header from "./header";
import Navbar from "./navbar";
import { Overview } from "./overview";
import { RecentActivities } from "./recent-acticities";
import { useWallets } from "@privy-io/react-auth";

const MainPage = () => {
  const { wallets } = useWallets();
  const [data, setData] = useState([]);
  const w0 = wallets[0];
  return (
    <div>
      {w0 && (
        <>
          <Header w0={w0} />
          <Navbar />
          <Overview w0={w0} data={data} setData={setData} />
          <RecentActivities w0={w0} data={data} setData={setData} />
        </>
      )}
    </div>
  );
};

export default MainPage;
