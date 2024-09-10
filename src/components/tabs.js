import React, { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { AdminDataTable, countries } from "./adminDatatable";
import { DelegateAddressTable } from "./delegateAddressTable";
import { Loader2 } from "lucide-react";
import Loader from "./loader";
import { getDelegateViewers } from "@/firebase/functions";
import Image from "next/image";
import { ConfigureMintTable } from "./configureMintTable";
import {
  erc20ContractAddress,
  erc20RulesABI,
  identityRegistryABI,
} from "@/contract";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Contract } from "ethers";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import CountrySelector from "./countrySelectorFromTo";

const Tabs = ({
  setCountry,
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
          setCountry={setCountry}
        />
      )}
      {active === "addIdentity" && (
        <AssociateCountryComponent w0={w0} setCountry={setCountry} />
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

const DecryptTab = ({
  w0,
  loading,
  data,
  decryptBalance,
  error,
  setCountry,
}) => {
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
          <AdminDataTable
            data={data}
            decryptBalance={decryptBalance}
            w0={w0}
            setCountry={setCountry}
          />
        </div>
      )}
    </div>
  );
};

const AssociateCountryComponent = ({ w0, setCountry }) => {
  const {
    encrytedERC20ContractAddress: { encrytedERC20ContractAddress },
    defaultTokenAddress: { defaultTokenAddress },
    identityRegistryContractAddress: { identityRegistryContractAddress },
    erc20RulesContractAddress: { erc20RulesContractAddress },
  } = useSelector((state) => state);

  const [address, setAddress] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [saveLoading, setSaveLoading] = useState(false);
  const createPath = async () => {
    const provider = await w0?.getEthersProvider();
    const signer = await provider?.getSigner();
    const contract = new Contract(
      erc20RulesContractAddress,
      erc20RulesABI,
      signer
    );

    console.log(w0.address);

    const txn = await contract.createPath("IN", "FR", true);
    await txn.wait(1);
  };

  const handleAddressChange = (e) => {
    setAddress(e.target.value);
  };

  // const setCountry = async () => {
  //   const provider = await w0?.getEthersProvider();
  //   const signer = await provider?.getSigner();

  //   const countrySetContract = new Contract(
  //     identityRegistryContractAddress,
  //     identityRegistryABI,
  //     signer
  //   );

  //   const txn = await countrySetContract.addDid(
  //     "0xb5e88d0A8a5100024B5606cf2BCB85Abdb85AF06"
  //   ); //if country is changed dont add did
  //   await txn.wait(1);

  //   const setCountryTxn = await countrySetContract.setIdentifier(
  //     "0xb5e88d0A8a5100024B5606cf2BCB85Abdb85AF06",
  //     "country",
  //     "India"
  //   );
  //   await setCountryTxn.wait(1);
  // };

  const handleSave = async () => {
    if (!address || !selectedCountry) {
      toast.error("Please enter an address and select a country");
      return;
    }
    setSaveLoading(true);
    try {
      await setCountry(address, selectedCountry, false);
      // Reset fields after successful save
      setAddress("");
      setSelectedCountry("");
      toast.success("Country associated successfully!");
    } catch (error) {
      console.error("Error saving:", error);
      toast.error("Failed to save. Please try again.");
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <>
      <div className="w-full bg-white rounded-2xl text-xl">
        <div className="p-6">
          <div className="grid gap-2">
            <p className="font-semibold">Associate Country with Address</p>
            <p className="text-sm text-muted-foreground">
              Enter an address and select its associated country.
            </p>
            <div className="flex items-center gap-6 mt-4">
              <Input
                placeholder="Address"
                value={address}
                onChange={handleAddressChange}
              />
              <Select
                value={selectedCountry}
                onValueChange={setSelectedCountry}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country.code} value={country.code}>
                      <div className="flex items-center">
                        <img
                          src={`https://flagsapi.com/${country.code}/flat/24.png`}
                          alt={`${country.name} flag`}
                          className="mr-2 h-4 w-6 object-cover"
                        />
                        {country.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button onClick={handleSave} disabled={saveLoading}>
                {saveLoading ? (
                  <div className="w-12 grid items-center justify-center">
                    <Loader2 className="animate-spin" />
                  </div>
                ) : (
                  "Save"
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <CountrySelector
        erc20RulesABI={erc20RulesABI}
        erc20RulesContractAddress={erc20RulesContractAddress}
        w0={w0}
      />
    </>
  );
};
