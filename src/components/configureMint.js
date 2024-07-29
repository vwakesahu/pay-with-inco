import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { getInstance } from "@/utils/fhEVM";
import { Loader2 } from "lucide-react";
import { Contract } from "ethers";
import { toast } from "sonner";
import { ERC20ABI } from "@/contract";
import { useSelector } from "react-redux";

export const ConfigureMint = ({ w0 }) => {
  const {
    erc20ContractAddress: { erc20ContractAddress },
  } = useSelector((state) => state);
  const [address, setAddress] = useState("");
  const [mintingFee, setMintingFee] = useState("");
  const [approveLoading, setApproveLoading] = useState(false);

  const handleAddressChange = (e) => {
    setAddress(e.target.value);
  };

  const handleMintingFeeChange = (e) => {
    setMintingFee(e.target.value);
  };

  const approve = async () => {
    setApproveLoading(true);
    try {
      const provider = await w0?.getEthersProvider();
      const signer = await provider?.getSigner();
      const encryptedERC20 = new Contract(
        erc20ContractAddress,
        ERC20ABI,
        signer
      );

      const owner = await encryptedERC20.owner();
      console.log(owner);
      const fhevmInstance = await getInstance();
      const encryptedAmmount = fhevmInstance.encrypt32(Number(mintingFee));

      const txn = await encryptedERC20.configureMinter(
        address,
        encryptedAmmount,
        { gasLimit: 1000000 }
      );
      await txn.wait(1);
      toast.success("Added minter successfully");
      console.log("Configure Bob as minter successful!");
      setApproveLoading(false);
    } catch (error) {
      setApproveLoading(false);
      console.log(error);
    }
  };

  return (
    <div className="px-8 mt-12">
      <p className="text-2xl font-semibold">Configure Mint</p>
      <div className="grid grid-cols-2 mt-4 gap-4">
        <Input
          placeholder="Address"
          value={address}
          onChange={handleAddressChange}
        />
        <Input
          placeholder="Minting Fee"
          value={mintingFee}
          onChange={handleMintingFeeChange}
        />
      </div>
      <Button className="mt-4" onClick={approve} disabled={approveLoading}>
        {approveLoading ? (
          <div className="w-20 grid items-center justify-center">
            <Loader2 className="animate-spin" />
          </div>
        ) : (
          "Approve"
        )}
      </Button>
    </div>
  );
};
