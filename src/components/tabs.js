import React, { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { AdminDataTable } from "./adminDatatable";
import { DelegateAddressTable } from "./delegateAddressTable";
import { Loader2 } from "lucide-react";
import Loader from "./loader";
import { getDelegateViewers } from "@/firebase/functions";
import Image from "next/image";
import { ConfigureMintTable } from "./configureMintTable";

const Tabs = ({
  active,
  w0,
  decryptBalance,
  address,
  handleAddressChange,
  delegate,
  approveLoading,
  data,
  adminError,
  loading,
  deligateData,
  delegateLoading,
  error,
}) => {
  return (
    <div className="w-full mt-6 pb-32">
      {active === "configureMint" && <ConfigureMintTab w0={w0} />}
      {active === "delegateViewer" && (
        <DelegateViewerTab
          approveLoading={approveLoading}
          w0={w0}
          data={deligateData}
          decryptBalance={decryptBalance}
          address={address}
          handleAddressChange={handleAddressChange}
          delegate={delegate}
          error={error}
          loading={delegateLoading}
        />
      )}
      {active === "decrypt" && (
        <DecryptTab
          w0={w0}
          data={data}
          decryptBalance={decryptBalance}
          error={adminError}
          loading={loading}
        />
      )}
    </div>
  );
};

export default Tabs;

const ConfigureMintTab = ({ w0 }) => {
  return (
    <div>
      <ConfigureMintTable />
    </div>
  );
};

const DelegateViewerTab = ({
  w0,
  delegate,
  decryptBalance,
  address,
  handleAddressChange,
  approveLoading,
  data,
  loading,
  error,
}) => {
  // const [error, setError] = useState(null);
  // const [loading, setLoading] = useState(true);
  // const [data, setData] = useState([]);

  return (
    <div>
      <div className="w-full bg-white rounded-2xl text-xl">
        <div className="p-6">
          <div className="grid gap-2">
            <p className="font-semibold">Add Delegated Viewer Address</p>
            <p className="text-sm text-muted-foreground">
              Delegated viewer address will be able to see encrypted balance of
              any users.
            </p>
            <div className="flex items-center gap-6 mt-4">
              <Input
                placeholder="Address"
                value={address}
                onChange={handleAddressChange}
              />
              <Button
                onClick={() => delegate("delegate", address)}
                disabled={approveLoading}
              >
                {approveLoading ? (
                  <div className="w-12 grid items-center justify-center">
                    <Loader2 className="animate-spin" />
                  </div>
                ) : (
                  "Delegate"
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full bg-white rounded-2xl text-xl mt-6">
        {loading ? (
          <div className="w-full flex items-center justify-center h-[40vh]">
            <Loader className="animate-spin" />
          </div>
        ) : error ? (
          <p className="w-full flex items-center justify-center h-[40vh]">
            {error}
          </p>
        ) : data.length === 0 ? (
          <div className="w-full flex flex-col gap-6 items-center justify-center min-h-[40vh] pb-40 pt-20">
            <div className="flex flex-col items-center justify-center p-6">
              <Image src="/not-found.svg" width={200} height={200} />
              <p className="text-muted-foreground mt-6 text-sm text-black max-w-sm text-center">
                No data found! Try sending some tokens
              </p>
            </div>
          </div>
        ) : (
          <div className="w-full">
            <DelegateAddressTable
              data={data}
              decryptBalance={decryptBalance}
              delegate={delegate}
            />
          </div>
        )}
      </div>
    </div>
  );
};

const DecryptTab = ({ w0, loading, data, decryptBalance, error }) => {
  return (
    <div>
      {loading ? (
        <div className="w-full flex items-center justify-center h-[40vh]">
          <Loader className="animate-spin" />
        </div>
      ) : error ? (
        <p className="w-full flex items-center justify-center h-[40vh]">
          {error}
        </p>
      ) : data.length === 0 ? (
        <div className="w-full flex flex-col gap-6 items-center justify-center min-h-[40vh] pb-40 pt-20">
          <div className="flex flex-col items-center justify-center p-6">
            <Image src="/not-found.svg" width={200} height={200} />
            <p className="text-muted-foreground mt-6 text-sm text-black max-w-sm text-center">
              No data found! Try sending some tokens
            </p>
          </div>
        </div>
      ) : (
        <div className="w-full">
          <AdminDataTable data={data} decryptBalance={decryptBalance} />
        </div>
      )}
    </div>
  );
};
