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
      <div className="flex items-center gap-4 ">
        <div
          className={`p-1 px-2.5 cursor-pointer hover:bg-white hover:border flex items-center justify-center gap-2 border border-[#71737F] bg-white rounded-lg`}
        >
          <Image src={`/icons/down-arrow.svg`} width={12} height={12} />
          <p className="font-medium">{"Last 7 days"}</p>
        </div>
      </div>
      <div className="flex items-center bg-[#ECEFF3] rounded-lg cursor-pointer">
        <div
          className={`p-1 px-2.5 rounded-lg ${
            active === "all"
              ? "bg-white border border-[#71737F] text-black"
              : ""
          }`}
          onClick={() => setActive("all")}
        >
          All {counts.all !== 0 && counts.all}
        </div>
        <div
          className={`p-1 px-2.5 rounded-lg ${
            active === "received"
              ? "bg-white border border-[#71737F] text-black"
              : ""
          }`}
          onClick={() => setActive("received")}
        >
          Received {counts.received !== 0 && counts.received}
        </div>
        <div
          className={`p-1 px-2.5 rounded-lg ${
            active === "sent"
              ? "bg-white border border-[#71737F] text-black  "
              : ""
          }`}
          onClick={() => setActive("sent")}
        >
          Sent {counts.sent !== 0 && counts.sent}
        </div>
      </div>
    </div>
  );
};
