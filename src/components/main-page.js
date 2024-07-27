"use client";
import React from "react";
import Header from "./header";
import Navbar from "./navbar";
import { Overview } from "./overview";
import { RecentActivities } from "./recent-acticities";

const MainPage = () => {
  return (
    <div>
      <Header />
      <Navbar />
      <Overview />
      <RecentActivities />
    </div>
  );
};

export default MainPage;


// const sampleData = [
//   {
//     type: "sent",
//     value: -51245,
//     status: "success",
//     activity: "sending money to 0x24a...245f",
//     addresses: "0xb5e88d0A8a5100024B5606cf2BCB85Abdb85AF06",
//     date: "Aug 28, 2023 3:40PM",
//   },
//   {
//     type: "received",
//     value: 45620,
//     status: "success",
//     activity: "sending money to 0x24a...245f",
//     addresses: "0xc6377415E...750FC",
//     date: "Aug 28, 2023 3:40PM",
//   },
//   {
//     type: "sent",
//     value: -51245,
//     status: "success",
//     activity: "sending money to 0x24a...245f",
//     addresses: "0xc6377415E...750FC",
//     date: "Aug 28, 2023 3:40PM",
//   },
//   {
//     type: "sent",
//     value: -51245,
//     status: "success",
//     activity: "sending money to 0x24a...245f",
//     addresses: "0xc6377415E...750FC",
//     date: "Aug 28, 2023 3:40PM",
//   },
//   {
//     type: "sent",
//     value: -51245,
//     status: "success",
//     activity: "sending money to 0x24a...245f",
//     addresses: "0xc6377415E...750FC",
//     date: "Aug 28, 2023 3:40PM",
//   },
// ];
