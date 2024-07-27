import React, { useCallback, useEffect, useState } from "react";
import { DataTable } from "./datatable";
import { db } from "@/firebase/config";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import Loader from "./loader";
import { Input } from "./ui/input";
import { debounce } from "@/utils/debounce";
import { DataType } from "./data-type";

export const RecentActivities = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [active, setActive] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const userAddress = "0xc6377415Ee98A7b71161Ee963603eE52fF7750FC";

  const debouncedFetchData = useCallback(
    debounce(async () => {
      setLoading(true);
      setError(null);

      try {
        const q = query(
          collection(db, "transactions"),
          where("address", "==", userAddress)
        );
        const querySnapshot = await getDocs(q);
        const fetchedData = querySnapshot.docs.map((doc) => doc.data());

        // Filter transactions based on the type and search query
        const filteredData = fetchedData.flatMap((doc) =>
          doc.transactions.filter((tx) => {
            const matchesType = active === "all" || tx.type === active;
            const matchesSearchQuery =
              tx.activity.toLowerCase().includes(searchQuery.toLowerCase()) ||
              tx.addresses.toLowerCase().includes(searchQuery.toLowerCase());

            return matchesType && matchesSearchQuery;
          })
        );

        setData(filteredData);
      } catch (e) {
        setError("Error fetching document: " + e.message);
      } finally {
        setLoading(false);
      }
    }, 300),
    [active, searchQuery]
  );

  // Fetch data initially and on changes to active or searchQuery
  useEffect(() => {
    debouncedFetchData();
  }, [active, searchQuery, debouncedFetchData]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="my-12 px-8">
      <p className="text-4xl font-semibold mb-12">Recent Activities</p>
      <div className="flex items-center justify-between w-full mb-4">
        <DataType active={active} setActive={setActive} />
        <Input
          placeholder="Search..."
          className="max-w-sm"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      {loading ? (
        <div className="w-full flex items-center justify-center h-[40vh]">
          <Loader />
        </div>
      ) : error ? (
        <p className="w-full flex items-center justify-center h-[40vh]">
          {error}
        </p>
      ) : data.length === 0 ? (
        <p className="w-full flex items-center justify-center h-[40vh]">
          No data
        </p>
      ) : (
        <DataTable
          data={data}
          setData={setData}
          active={active}
          setActive={setActive}
        />
      )}
    </div>
  );
};
