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
import { Button } from "@/components/ui/button";
import { Input } from "./ui/input";
import { addTransaction } from "@/firebase/functions";
import { useState } from "react";
import Loader from "./loader";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Contract } from "ethers";
import { ERC20ABI, erc20ContractAddress } from "@/contract";
import { getInstance } from "@/utils/fhEVM";

export function RequestButton({ w0, balanceOfEncryptedErc20 }) {
  const [open, setOpen] = useState(false);
  const [receiverAddress, setReceiverAddress] = useState("");
  const [value, setValue] = useState();
  const [loading, setLoading] = useState(false);
  const mint = async (e) => {
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

      const txn = await encryptedERC20.mint(
        w0.address,
        fhevmInstance.encrypt32(Number(value))
      );
      await txn.wait(1);

      console.log("Minting 1e5 usdc to bob successful!");
      toast.success("Minting successful");
      await balanceOfEncryptedErc20();
      setLoading(false);
      setOpen(false);
      toast.success("Transaction added successfully");
    } catch (error) {
      console.error("Error adding transaction", error);
      setLoading(false);
      toast.error("Error adding transaction");
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={(e) => setOpen(e)}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className="mt-2 py-8 px-16">
          Request
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Send Tokens</AlertDialogTitle>
          <AlertDialogDescription>
            This action is irreversible. Proceeding will permanently transfer
            your ERC20 tokens from your account to the specified
            recipient&apos;s account.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Input
          placeholder="Recipient's Address. eg.: 0x4557..65"
          value={w0.address}
          disabled
        />
        <Input
          placeholder="Tokens to be sent"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction disabled={loading} onClick={(e) => mint(e)}>
            {loading ? (
              <div className="w-12 grid items-center justify-center">
                <Loader2 className="animate-spin" />
              </div>
            ) : (
              "Continue"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
