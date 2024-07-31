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
import { defaultTokenAddress, ERC20ABI } from "@/contract";
import { getInstance } from "@/utils/fhEVM";
import { useSelector } from "react-redux";
import { Label } from "./ui/label";
import { deafaultERC20ABI } from "@/contract/deafultERC20";
import { erc20ABI } from "@/contract/erc20";

export function IncreaseAllowance({ w0, balanceOfDeafaultErc20 }) {
  const {
    erc20ContractAddress: { erc20ContractAddress },
  } = useSelector((state) => state);
  const [open, setOpen] = useState(false);
  const [userInputAddress, setUserInputAddress] = useState("");
  const [value, setValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const increaseAllowance = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const provider = await w0?.getEthersProvider();
      const signer = await provider?.getSigner();
      const contract_cUSDC = new Contract(
        erc20ContractAddress,
        erc20ABI,
        signer
      );
      const fhevmInstance = await getInstance();

      const txn = await contract_cUSDC.increaseAllowance(
        userInputAddress,
        fhevmInstance.encrypt32(value)
      );
      console.log("Transaction hash:", txn.hash);

      // Wait for 1 confirmation (adjust confirmations as needed)
      await txn.wait(1);
      console.log("Bob allowing 1e5 tokens to Carol successful!");
      toast.success("Allowance increase successful");
    } catch (error) {
      console.error("Transaction failed:", error);
      toast.error("Transaction failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={(e) => setOpen(e)}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className="rounded-full">
          Increase Allowance
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl">
            Increase Allowance
          </AlertDialogTitle>
        </AlertDialogHeader>
        <Label className="font-bold">Address</Label>
        <div className="relative">
          <Input
            placeholder="Address"
            value={userInputAddress}
            onChange={(e) => setUserInputAddress(e.target.value)}
          />
        </div>
        <Label className="font-bold">Amount</Label>
        <div className="relative">
          <Input
            placeholder="Tokens to be sent"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <p className="absolute right-2 top-2 text-[#808080]">USDC</p>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel className="bg-[#EEEEEE]">Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={loading}
            onClick={(e) => increaseAllowance(e)}
          >
            {loading ? (
              <div className="w-12 grid items-center justify-center">
                <Loader2 className="animate-spin" />
              </div>
            ) : (
              "Confirm"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
