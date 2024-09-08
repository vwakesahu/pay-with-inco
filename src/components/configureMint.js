import { useCallback, useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { getInstance, getSignature } from "@/utils/fhEVM";

import { Contract } from "ethers";
import { toast } from "sonner";
import { ERC20ABI, identityRegistryABI } from "@/contract";
import { useSelector } from "react-redux";
import { AdminDataTable } from "./adminDatatable";
import {
  addDelegateViewer,
  fetchAdminTable,
  getDelegateViewers,
  removeDelegateViewer,
} from "@/firebase/functions";
import Image from "next/image";
import Loader from "./loader";
import { Loader2 } from "lucide-react";
import { debounce } from "@/utils/debounce";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "@/firebase/config";
import Tabs from "./tabs";

export const ConfigureMint = ({ w0 }) => {
  const [data, setData] = useState([]);
  const {
    encrytedERC20ContractAddress: { encrytedERC20ContractAddress },
    defaultTokenAddress: { defaultTokenAddress },
    identityRegistryContractAddress: { identityRegistryContractAddress },
  } = useSelector((state) => state);
  const [address, setAddress] = useState("");
  const [mintingFee, setMintingFee] = useState("");
  const [approveLoading, setApproveLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [delegateViewerTabError, setDelegateViewerTabError] = useState(null);
  const [delegateViewerTabLoading, setDelegateViewerTabLoading] =
    useState(true);
  const [delegateViewerTabData, setDelegateViewerTabData] = useState([]);

  const [active, setActive] = useState("delegateViewer");
  const debouncedFetchData = useCallback(
    debounce(async () => {
      setLoading(true);
      setError(null);

      try {
        const q = query(collection(db, "transactions"));
        const querySnapshot = await getDocs(q);
        const fetchedData = querySnapshot.docs.map((doc) => doc.data());

        // Flatten and sort data client-side
        const allTransactions = fetchedData.flatMap((doc) => doc.address);

        // Filter transactions based on the type and search query
        const filteredData = allTransactions.filter((tx) => {
          const matchesSearchQuery = tx
            .toLowerCase()
            .includes(searchQuery.toLowerCase());

          return matchesSearchQuery;
        });

        const finalData = filteredData.map((address, index) => ({
          index,
          address,
        }));
        console.log(finalData);
        const d = await fetchAssociatedCountries(finalData);
        console.log(d);
        setData(d);
      } catch (e) {
        console.error(e); // Log error for debugging
        setError("Error fetching document: " + e.message);
      } finally {
        setLoading(false);
      }
    }, 300),
    [searchQuery, w0]
  );

  async function fetchAssociatedCountries(tempdata) {
    const provider = await w0?.getEthersProvider();
    const signer = await provider?.getSigner();
    const countryDetailContract = new Contract(
      identityRegistryContractAddress,
      identityRegistryABI,
      signer
    );

    const data = await Promise.all(
      tempdata.map(async (item) => {
        try {
          const country = await countryDetailContract.seeCountry(item.address);
          return {
            ...item,
            associatedCountry: country,
          };
        } catch (error) {
          console.error(
            `Error fetching country for address ${item.address}:`,
            error
          );
          return {
            ...item,
            associatedCountry: "Unknown",
          };
        }
      })
    );

    return data;
  }

  // Fetch data initially and on changes to  searchQuery, or w0
  useEffect(() => {
    debouncedFetchData();
  }, [searchQuery, debouncedFetchData, w0]);

  const getDelegateViewersData = async () => {
    const data = await getDelegateViewers(
      setDelegateViewerTabLoading,
      setDelegateViewerTabError
    );
    setDelegateViewerTabData(data);
  };

  const getAdminTableData = async () => {
    const d = await fetchAdminTable(setLoading, setError);
    setData(d);
  };
  useEffect(() => {
    getAdminTableData();
    getDelegateViewersData();
  }, []);

  const handleAddressChange = (e) => {
    setAddress(e.target.value);
  };

  const handleMintingFeeChange = (e) => {
    setMintingFee(e.target.value);
  };

  const delegate = async (type, add) => {
    if (type === "delegate") {
      setApproveLoading(true);
    }
    try {
      const provider = await w0?.getEthersProvider();
      const signer = await provider?.getSigner();
      const encryptedERC20 = new Contract(
        encrytedERC20ContractAddress,
        ERC20ABI,
        signer
      );

      // const owner = await encryptedERC20.owner();
      // console.log(owner);
      // console.log(
      //   await encryptedERC20.delegateViewer(
      //     "0xb5e88d0A8a5100024B5606cf2BCB85Abdb85AF06"
      //   )
      // );
      // console.log(
      //   await encryptedERC20.delegateViewer(
      //     "0x4D1bb64026eE02AB61897DCa915567F7c1243102"
      //   )
      // );

      // console.log(
      //   await encryptedERC20.delegateViewer(
      //     "0xc6377415Ee98A7b71161Ee963603eE52fF7750FC"
      //   )
      // );
      // setApproveLoading(false);
      // return;

      console.log(add);
      let txn;
      if (type === "delegate") {
        txn = await encryptedERC20.delegateViewerStatus(add, true);
      } else {
        txn = await encryptedERC20.delegateViewerStatus(add, false);
      }
      await txn.wait(1);
      if (type === "delegate") {
        await addDelegateViewer(add);
        console.log("delegating the viewing rights to dave successful!");
        toast.success("Successfully delegated the viewing rights!");
      } else {
        await removeDelegateViewer(add);
        console.log("revoking the viewing rights to dave successful!");
        toast.success("Successfully revoked the viewing rights!");
      }
      await getDelegateViewersData();

      setApproveLoading(false);
    } catch (error) {
      setApproveLoading(false);
      toast.error("Error delegating the viewing rights!");
      console.log(error);
    }
  };

  const decryptBalance = async (address) => {
    console.log(address);
    try {
      const provider = await w0?.getEthersProvider();
      const signer = await provider?.getSigner();
      const encryptedERC20 = new Contract(
        encrytedERC20ContractAddress,
        ERC20ABI,
        signer
      );
      const owner = await encryptedERC20.owner();
      console.log(w0.address);
      console.log(owner);
      const fhevmInstance = await getInstance();
      // const encryptedAmmount = fhevmInstance.encrypt32(Number(mintingFee));
      const { publicKey, signature } = await getSignature(
        encrytedERC20ContractAddress,
        w0.address,
        fhevmInstance
      );

      const carolBalance = await encryptedERC20.balanceOf(
        publicKey,
        signature,
        address
        // "0xb5e88d0A8a5100024B5606cf2BCB85Abdb85AF06"
      );
      // console.log(carolBalance);
      console.log(fhevmInstance.hasKeypair(encrytedERC20ContractAddress));
      const decryptedBalance = await fhevmInstance
        .decrypt(encrytedERC20ContractAddress, carolBalance)
        .toString();
      console.log(decryptedBalance);

      setData((prevData) =>
        prevData.map((item) =>
          item.address === address ? { ...item, decryptedBalance } : item
        )
      );
      toast.success("Balance decrypted successfully!");
    } catch (error) {
      toast.error("Error decrypting the balance!");
      console.log(error);
    }
  };

  const setCountry = async (address, count, forUpdating) => {
    console.log(address, count);
    const provider = await w0?.getEthersProvider();
    const signer = await provider?.getSigner();

    const countrySetContract = new Contract(
      identityRegistryContractAddress,
      identityRegistryABI,
      signer
    );

    console.log(forUpdating);

    if (!forUpdating) {
      const txn = await countrySetContract.addDid(address);
      await txn.wait(1);
    }

    const setCountryTxn = await countrySetContract.setIdentifier(
      address,
      "country",
      count
    );
    await setCountryTxn.wait(1);
  };
  return (
    <div className="px-8 mt-12 grid place-items-center">
      {/* <button onClick={setCountry}>xvfd</button> */}
      <div className="w-[40rem]">
        <div className="w-full grid grid-cols-4 gap-3">
          <Button
            onClick={() => setActive("delegateViewer")}
            className={`w-full border-none text-black rounded-full hover:bg-white ${
              active === "delegateViewer"
                ? "bg-white drop-shadow-sm"
                : "bg-transparent"
            }`}
          >
            Delegate Viewer
          </Button>
          <Button
            onClick={async () => {
              await debouncedFetchData();
              setActive("decrypt");
            }}
            className={`w-full border-none text-black rounded-full hover:bg-white ${
              active === "decrypt"
                ? "bg-white drop-shadow-sm"
                : "bg-transparent"
            }`}
          >
            Decrypt
          </Button>
          <Button
            onClick={() => setActive("configureMint")}
            className={`w-full border-none text-black rounded-full hover:bg-white ${
              active === "configureMint"
                ? "bg-white drop-shadow-sm"
                : "bg-transparent"
            }`}
          >
            Configure Mint
          </Button>
          <Button
            onClick={() => setActive("addIdentity")}
            className={`w-full border-none text-black rounded-full hover:bg-white ${
              active === "addIdentity"
                ? "bg-white drop-shadow-sm"
                : "bg-transparent"
            }`}
          >
            Add Identity
          </Button>
        </div>
        {/* {console.log(data)} */}
        <Tabs
          data={data}
          loading={loading}
          adminError={error}
          error={delegateViewerTabError}
          delegateLoading={delegateViewerTabLoading}
          deligateData={delegateViewerTabData}
          delegate={delegate}
          active={active}
          w0={w0}
          decryptBalance={decryptBalance}
          address={address}
          handleAddressChange={handleAddressChange}
          approveLoading={approveLoading}
          setCountry={setCountry}
        />
      </div>

      {/* <Button onClick={decryptBalance}>ajzhvc</Button> */}
      {/* <p className="text-2xl font-semibold">Add Delegate Viewer</p>
      <div className="grid grid-cols-6 mt-4 gap-4">
        <Input
          placeholder="Address"
          value={address}
          onChange={handleAddressChange}
        />
        <Button onClick={delegate} disabled={approveLoading}>
          {approveLoading ? (
            <div className="w-12 grid items-center justify-center">
              <Loader2 className="animate-spin" />
            </div>
          ) : (
            "Add Viewer Address"
          )}
        </Button>
      </div>

      <div className="mt-12">
        <p className="text-2xl font-semibold">Decrypt user balance</p>
        <div className="mt-4 gap-4 flex items-center justify-end">
          <div></div>
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
        <div className="mt-4 gap-4 w-full">
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
      </div> */}
    </div>
  );
};
