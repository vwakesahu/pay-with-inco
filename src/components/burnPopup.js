import { Loader2 } from "lucide-react";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { Contract } from "ethers";
import { ERC20ABI, erc20ContractAddress } from "@/contract";
import { getInstance } from "@/utils/fhEVM";
import { toast } from "sonner";

const BurnToken = ({ w0, balanceOfEncryptedErc20, balance }) => {
  const [loading, setLoading] = useState(false);
  const burn = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const provider = await w0?.getEthersProvider();
      const signer = await provider?.getSigner();
      const encryptedERC20 = new Contract(
        erc20ContractAddress,
        ERC20ABI,
        signer
      );
      const fhevmInstance = await getInstance();

      const txn = await encryptedERC20.burn(
        w0.address,
        fhevmInstance.encrypt32(Number(balance))
      );
      await txn.wait(1);

      console.log("Burned");
      toast.success("Burned successful");
      await balanceOfEncryptedErc20();
      setLoading(false);
      setOpen(false);
    } catch (error) {
      console.error("Error performing burn", error);
      setLoading(false);
      toast.error("Error performing burn");
    }
  };
  return (
    <div>
      <Button
        variant="outline"
        className="mt-2 py-8 px-16"
        disabled={loading}
        onClick={burn}
      >
        &nbsp;
        {loading ? (
          <div className="w-12 grid items-center justify-center">
            <Loader2 className="animate-spin" />
          </div>
        ) : (
          "Burn"
        )}
        &nbsp;
      </Button>
    </div>
  );
};

export default BurnToken;
