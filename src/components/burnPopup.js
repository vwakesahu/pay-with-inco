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
import Image from "next/image";
import { Label } from "./ui/label";

const BurnToken = ({ w0, balanceOfEncryptedErc20, balance, setData }) => {
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
      setData((prevData) => [transaction, ...prevData]);

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
          <Button variant="outline" className="bg-[#EEEEEE]">
            Decrypt
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="p-0 min-w-fit">
          <div className="flex">
            <div className="p-8 h-full bg-[#BCD0FC] grid place-content-between">
              <Image src={"/icons/decrypt.svg"} width={153} height={153} />
            </div>
            <div className="p-8 pb-6">
              <AlertDialogHeader>
                <AlertDialogTitle>Decrypt</AlertDialogTitle>
                <AlertDialogDescription className="w-80">
                  Decrypted balance will be visible on-chain.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="mt-6">
                <div className="w-full flex items-center justify-between">
                  <Label className="font-bold">Amount</Label>
                  <p className="text-sm text-muted-foreground">
                    Available: {balance} USDC
                  </p>
                </div>
                <div className="relative w-full pb-8">
                  <Input
                    placeholder="Tokens to be burned"
                    className="mt-3"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                  />
                  <div
                    className="absolute right-2 text-[#1958DF] cursor-pointer top-2"
                    onClick={() => setValue(balance)}
                  >
                    Max
                  </div>
                </div>
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-[#EEEEEE]">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction disabled={loading} onClick={burn}>
                  {loading ? (
                    <div className="w-12 grid items-center justify-center">
                      <Loader2 className="animate-spin" />
                    </div>
                  ) : (
                    "Confirm"
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </div>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default BurnToken;
