import Image from "next/image";

export const DataType = ({ active, setActive }) => {
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
          All 20
        </div>
        <div
          className={`p-1 px-2.5 rounded-lg ${
            active === "received"
              ? "bg-white border border-[#71737F] text-black"
              : ""
          }`}
          onClick={() => setActive("received")}
        >
          Received 35
        </div>
        <div
          className={`p-1 px-2.5 rounded-lg ${
            active === "sent"
              ? "bg-white border border-[#71737F] text-black  "
              : ""
          }`}
          onClick={() => setActive("sent")}
        >
          Sent 15
        </div>
      </div>
    </div>
  );
};
