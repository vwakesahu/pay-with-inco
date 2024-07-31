import React, { useCallback, useEffect, useState } from "react";
import { DataTable } from "./datatable";
import { db } from "@/firebase/config";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import Loader from "./loader";
import { Input } from "./ui/input";
import { debounce } from "@/utils/debounce";
import { DataType } from "./data-type";
import Image from "next/image";

export const RecentActivities = ({ w0, data, setData }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [active, setActive] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedFetchData = useCallback(
    debounce(async () => {
      setLoading(true);
      setError(null);

      try {
        const q = query(
          collection(db, "transactions"),
          where("address", "==", w0.address)
        );
        const querySnapshot = await getDocs(q);
        const fetchedData = querySnapshot.docs.map((doc) => doc.data());

        // Flatten and sort data client-side
        const allTransactions = fetchedData.flatMap((doc) => doc.transactions);

        // Filter transactions based on the type and search query
        const filteredData = allTransactions.filter((tx) => {
          const matchesType = active === "all" || tx.type === active;
          const matchesSearchQuery =
            tx.activity.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tx.addresses.toLowerCase().includes(searchQuery.toLowerCase());

          return matchesType && matchesSearchQuery;
        });

        // Function to parse date strings into Date objects
        const parseDate = (dateString) => new Date(dateString);

        // Sort transactions by the `date` field in descending order
        const sortedData = filteredData.sort((a, b) => {
          const aDate = parseDate(a.date);
          const bDate = parseDate(b.date);
          return bDate - aDate; // Descending order
        });

        setData(sortedData);
      } catch (e) {
        console.error(e); // Log error for debugging
        setError("Error fetching document: " + e.message);
      } finally {
        setLoading(false);
      }
    }, 300),
    [active, searchQuery, w0]
  );

  // Fetch data initially and on changes to active, searchQuery, or w0
  useEffect(() => {
    debouncedFetchData();
  }, [active, searchQuery, debouncedFetchData, w0]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="my-12 px-8">
      <p className="text-3xl font-semibold mb-6">Recent Activities</p>
      <div className="flex items-center justify-between w-full">
        <DataType active={active} setActive={setActive} data={data} />
        <div className="flex items-center gap-2 bg-white px-4 py-3 rounded-full overflow-hidden">
          <Image src="/icons/search-icon.svg" width={20} height={20} />
          <input
            placeholder="Search transactions"
            className="max-w-sm focus:outline-none"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
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
        <div className="w-full flex flex-col gap-6 items-center justify-center min-h-[40vh] pb-40 pt-20">
          <div className="flex flex-col items-center justify-center p-6 bg-white drop-shadow-sm rounded-lg">
            <Image src="/not-found.svg" width={200} height={200} />
            <p className="text-xl font-semibold text-black max-w-sm text-center">
              No data found! Try sending some tokens
            </p>
          </div>
        </div>
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
