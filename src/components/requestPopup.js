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

export function RequestButton({
  w0,
  balanceOfEncryptedErc20,
  balanceOfDeafaultErc20,
}) {
  const {
    encrytedERC20ContractAddress: { encrytedERC20ContractAddress },
    defaultTokenAddress: { defaultTokenAddress },
  } = useSelector((state) => state);
  const [open, setOpen] = useState(false);
  const [receiverAddress, setReceiverAddress] = useState("");
  const [value, setValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const mintAndApprove = async (e) => {
    e.preventDefault();
    setLoading(true);
    const provider = await w0?.getEthersProvider();
    const signer = await provider?.getSigner();
    const contract_USDC = new Contract(
      defaultTokenAddress,
      deafaultERC20ABI,
      signer
    );
    try {
      const txn = await contract_USDC.mint(w0.address, value);
      console.log("Transaction hash:", txn.hash);

      // Wait for 1 confirmation (adjust confirmations as needed)
      await txn.wait(1);
      console.log("minting 1e6 tokens to bob successful");
    } catch (error) {
      setLoading(false);
      console.error("Transaction failed:", error);
      // Handle the error appropriately (e.g., retry, notify user)
    }

    console.log(
      "USDC balance of Bob:" + (await contract_USDC.balanceOf(w0.address))
    );
    toast.success("Initializing approval");
    try {
      const txn = await contract_USDC.approve(
        encrytedERC20ContractAddress,
        value
      );
      console.log("Transaction hash:", txn.hash);

      // Wait for 1 confirmation (adjust confirmations as needed)
      await txn.wait(1);
      toast.success("Approval successful");
      console.log("bob approved cUSDC 1e15 tokens successful");
      setLoading(false);
      setOpen(false);
      await balanceOfDeafaultErc20();
    } catch (error) {
      setLoading(false);
      console.error("Transaction failed:", error);
    }
  };
  // const mint = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);

  //   try {
  //     const provider = await w0?.getEthersProvider();
  //     const signer = await provider?.getSigner();
  //     const encryptedERC20 = new Contract(
  //       erc20ContractAddress,
  //       ERC20ABI,
  //       signer
  //     );
  //     const fhevmInstance = await getInstance();

  //     const txn = await encryptedERC20.mint(
  //       w0.address,
  //       fhevmInstance.encrypt32(Number(value))
  //     );
  //     await txn.wait(1);

  //     // console.log("Minting 1e5 usdc to bob successful!");
  //     // toast.success("Minting successful");
  //     await balanceOfEncryptedErc20();
  //     setLoading(false);
  //     setOpen(false);
  //     toast.success("Balance added successfully");
  //   } catch (error) {
  //     console.error("Error adding transaction", error);
  //     setLoading(false);
  //     toast.error("Error adding transaction");
  //   }
  // };

  return (
    <AlertDialog open={open} onOpenChange={(e) => setOpen(e)}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className="rounded-full">
          Get Test Token
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl">
            Get Test Tokens
          </AlertDialogTitle>
        </AlertDialogHeader>
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
            onClick={(e) => mintAndApprove(e)}
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
