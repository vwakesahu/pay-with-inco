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

const WrapToken = ({
  w0,
  balanceOfEncryptedErc20,
  balance,
  setData,
  balanceOfDeafaultErc20,
}) => {
  const [open, setOpen] = useState(false);
  const {
    encrytedERC20ContractAddress: { encrytedERC20ContractAddress },
    defaultTokenAddress: { defaultTokenAddress },
  } = useSelector((state) => state);
  const [value, setValue] = useState();
  const [loading, setLoading] = useState(false);
  const wrap = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const provider = await w0?.getEthersProvider();
      const signer = await provider?.getSigner();
      console.log(encrytedERC20ContractAddress);
      const encryptedERC20 = new Contract(
        encrytedERC20ContractAddress,
        ERC20ABI,
        signer
      );

      const txn = await encryptedERC20.wrap(value);
      await txn.wait(1);
      await balanceOfEncryptedErc20();
      await balanceOfDeafaultErc20();

      setLoading(false);
      setOpen(false);
    } catch (error) {
      console.error("Error performing wrap", error);
      setLoading(false);
      toast.error("Error performing wrap");
    }
  };
  return (
    <div>
      <AlertDialog open={open} onOpenChange={(e) => setOpen(e)}>
        <AlertDialogTrigger asChild>
          <Button variant="outline" className="bg-[#EEEEEE] mt-4">
            Wrap
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="p-0 min-w-fit">
          <div className="flex">
            <div className="p-8 h-full bg-[#BCD0FC] grid place-content-between">
              <Image src={"/icons/decrypt.svg"} width={153} height={153} />
            </div>
            <div className="p-8 pb-6">
              <AlertDialogHeader>
                <AlertDialogTitle>Wrap</AlertDialogTitle>
                <AlertDialogDescription className="w-80">
                  Encrypted balance will be visible on-chain.
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
                <AlertDialogAction disabled={loading} onClick={wrap}>
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

export default WrapToken;
