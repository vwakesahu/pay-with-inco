import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { getInstance, getSignature } from "@/utils/fhEVM";

import { Contract } from "ethers";
import { toast } from "sonner";
import { ERC20ABI } from "@/contract";
import { useSelector } from "react-redux";
import { AdminDataTable } from "./adminDatatable";
import { fetchAdminTable } from "@/firebase/functions";
import Image from "next/image";
import Loader from "./loader";
import { Loader2 } from "lucide-react";

export const ConfigureMint = ({ w0 }) => {
  const [data, setData] = useState([]);
  const { encrytedERC20ContractAddress, defaultTokenAddress } = useSelector(
    (state) => state
  );
  const [address, setAddress] = useState("");
  const [mintingFee, setMintingFee] = useState("");
  const [approveLoading, setApproveLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getAdminTableData = async () => {
    const d = await fetchAdminTable(setLoading, setError);
    setData(d);
  };
  useEffect(() => {
    getAdminTableData();
  }, []);

  const handleAddressChange = (e) => {
    setAddress(e.target.value);
  };

  const handleMintingFeeChange = (e) => {
    setMintingFee(e.target.value);
  };

  const delegate = async () => {
    setApproveLoading(true);
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

      console.log(address);

      const txn = await encryptedERC20.delegateViewerStatus(address, true);
      await txn.wait(1);
      console.log("delegating the viewing rights to dave successful!");
      toast.success("Delegating the viewing rights successful!");
      setApproveLoading(false);
    } catch (error) {
      setApproveLoading(false);
      toast.error("Error delegating the viewing rights!");
      console.log(error);
    }
  };

  console.log(data);
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
  return (
    <div className="px-8 mt-12">
      {/* <Button onClick={decryptBalance}>ajzhvc</Button> */}
      <p className="text-2xl font-semibold">Add Delegate Viewer</p>
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
      </div>
    </div>
  );
};
