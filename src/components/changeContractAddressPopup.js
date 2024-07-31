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
import { useState } from "react";
import { Label } from "./ui/label";
import { InfoIcon } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  resresetEncryptedAddressetUser,
  setEncryptedAddress,
} from "@/redux/slices/userSlice";
import {
  resetSetDefaultAddress,
  setDefaultTokenAddress,
} from "@/redux/slices/normalERCSlice";

export function ChangeContractAddress() {
  const dispath = useDispatch();
  const [open, setOpen] = useState(false);
  const {
    encrytedERC20ContractAddress: { encrytedERC20ContractAddress },
    defaultTokenAddress: { defaultTokenAddress },
  } = useSelector((state) => state);
  const [value, setValue] = useState(0);

  return (
    <AlertDialog open={open} onOpenChange={(e) => setOpen(e)}>
      <AlertDialogTrigger asChild>
        <InfoIcon />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl">
            Change Contract Address
          </AlertDialogTitle>
        </AlertDialogHeader>
        <Label className="font-bold">USDC Contract Address</Label>
        <div className="relative">
          <Input
            placeholder="Address"
            value={defaultTokenAddress}
            onChange={(e) => dispath(setDefaultTokenAddress(e.target.value))}
          />
        </div>
        <Label className="font-bold">cUSDC Contract Address</Label>
        <div className="relative">
          <Input
            placeholder="Tokens to be sent"
            value={encrytedERC20ContractAddress}
            onChange={(e) => dispath(setEncryptedAddress(e.target.value))}
          />
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={(e) => {
              e.preventDefault();
              dispath(
                setEncryptedAddress(
                  "0x57AA69098170443316d6aaD384bBbf130756861E"
                )
              );
              dispath(
                setDefaultTokenAddress(
                  "0xB39615668D63c31B4E16aC87BC3f0feDFb30A676"
                )
              );
            }}
            className="bg-[#EEEEEE]"
          >
            Reset
          </AlertDialogCancel>
          <AlertDialogAction>Confirm</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
