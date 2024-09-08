import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "./ui/input";
import { useState } from "react";
import { Label } from "./ui/label";
import { InfoIcon } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setEncryptedAddress } from "@/redux/slices/userSlice";
import { setDefaultTokenAddress } from "@/redux/slices/normalERCSlice";
import { defaultTokenIntialState } from "@/redux/intialStates/normalTokenAddress";
import { identityRegistryIntialState } from "@/redux/intialStates/identityRegistryIntialstate";
import { encryptedERC20IntialState } from "@/redux/intialStates/userInitialState";
import { erc20RulesContractAddressIntialState } from "@/redux/intialStates/erc20RulesContractAddressIntialState";
import { setErc20RulesContractAddress } from "@/redux/slices/erc20RulesSlice";
import { setIdentityRegistryContractAddress } from "@/redux/slices/identityRegistrySlice";

export function ChangeContractAddress() {
  const dispath = useDispatch();
  const [open, setOpen] = useState(false);
  const {
    encrytedERC20ContractAddress: { encrytedERC20ContractAddress },
    defaultTokenAddress: { defaultTokenAddress },
  } = useSelector((state) => state);
  const [value, setValue] = useState(0);
  const { identityRegistryContractAddress } = useSelector(
    (st) => st.identityRegistryContractAddress
  );
  const { erc20RulesContractAddress } = useSelector(
    (st) => st.erc20RulesContractAddress
  );

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
        <Label className="font-bold">Identity Registry Contract Address</Label>
        <div className="relative">
          <Input
            placeholder="Tokens to be sent"
            value={identityRegistryContractAddress}
            onChange={(e) =>
              dispath(setIdentityRegistryContractAddress(e.target.value))
            }
          />
        </div>
        <Label className="font-bold">ERC20 Rules Contract Address</Label>
        <div className="relative">
          <Input
            placeholder="Tokens to be sent"
            value={erc20RulesContractAddress}
            onChange={(e) =>
              dispath(setErc20RulesContractAddress(e.target.value))
            }
          />
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={(e) => {
              e.preventDefault();
              dispath(setEncryptedAddress(encryptedERC20IntialState));
              dispath(setDefaultTokenAddress(defaultTokenIntialState));
              dispath(
                setErc20RulesContractAddress(
                  erc20RulesContractAddressIntialState
                )
              );
              dispath(
                setIdentityRegistryContractAddress(identityRegistryIntialState)
              );
            }}
            className="bg-[#EEEEEE]"
          >
            Reset
          </AlertDialogCancel>
          <AlertDialogAction>Close</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
