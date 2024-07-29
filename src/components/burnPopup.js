import { Loader2 } from "lucide-react";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { Contract } from "ethers";
import { ERC20ABI } from "@/contract";
import { getInstance } from "@/utils/fhEVM";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "./ui/input";
import { burnToken } from "@/firebase/functions";

const BurnToken = ({ w0, balanceOfEncryptedErc20, balance }) => {
  const [open, setOpen] = useState(false);
  const {
    erc20ContractAddress: { erc20ContractAddress },
  } = useSelector((state) => state);
  const [value, setValue] = useState();
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
      // console.log(encryptedERC20)

      const txn = await encryptedERC20.burn(
        fhevmInstance.encrypt32(Number(value))
      );
      await txn.wait(1);
      const transaction = {
        type: "burned",
        value: 0,
        status: "success",
        transactionHash: txn.hash,
        activity: `Burned tokens`,
        addresses: w0.address,
        receiverAddress: "",
        date: new Date().toISOString(),
      };
      await burnToken(w0.address, transaction);

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
      <AlertDialog open={open} onOpenChange={(e) => setOpen(e)}>
        <AlertDialogTrigger asChild>
          <Button variant="outline" className="mt-2 py-8 px-16">
            Burn
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Burn Tokens</AlertDialogTitle>
            <AlertDialogDescription>
              This action is irreversible. Proceeding will permanently burn your
              ERC20 tokens from your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div>
            <Input
              placeholder="Tokens to be burned"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
            <p className="text-sm text-muted-foreground mt-1 text-right">
              Max: {balance}
            </p>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction disabled={loading} onClick={burn}>
              {loading ? (
                <div className="w-12 grid items-center justify-center">
                  <Loader2 className="animate-spin" />
                </div>
              ) : (
                "Burn"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default BurnToken;
