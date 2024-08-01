import { fetchAdminTable } from "@/firebase/functions";
import Image from "next/image";
import { useEffect, useState } from "react";

export const DataType = ({ active, setActive, data }) => {
  const [counts, setCounts] = useState({
    received: 0,
    sent: 0,
    all: data.length,
  });
  useEffect(() => {
    setCounts(countTransactions(data));
  }, [data]);

  const countTransactions = (data) => {
    const counts = {
      received: 0,
      sent: 0,
      all: data.length,
    };
    data.forEach((transaction) => {
      if (transaction.type === "received") {
        counts.received++;
      } else if (transaction.type === "sent") {
        counts.sent++;
      }
    });

    return counts;
  };

  return (
    <div className="flex gap-4">
      {/* <div
        className="flex items-center gap-4"
        // onClick={() => fetchAdminTable("all", "")}
      >
        <div
          className={`px-6 py-3 cursor-pointer bg-white flex items-center justify-center gap-2  rounded-full`}
        >
          <p className="font-medium">{"Last 7 days"}</p>
          <Image src={`/icons/down-arrow.svg`} width={20} height={20} />
        </div>
      </div> */}
      <div className="flex items-center  rounded-lg cursor-pointer">
        <div
          className={`p-3 px-6  ${
            active === "all"
              ? "bg-white h-full flex items-center justify-center rounded-full text-black"
              : ""
          }`}
          onClick={() => setActive("all")}
        >
          All
        </div>
        <div
          className={`p-3 px-6  ${
            active === "received"
              ? "bg-white h-full flex items-center justify-center rounded-full text-black"
              : ""
          }`}
          onClick={() => setActive("received")}
        >
          Received
        </div>
        <div
          className={`p-3 px-6  ${
            active === "sent"
              ? "bg-white h-full flex items-center justify-center rounded-full text-black"
              : ""
          }`}
          onClick={() => setActive("sent")}
        >
          Sent
        </div>
      </div>
    </div>
  );
};
