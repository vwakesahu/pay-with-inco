import Image from "next/image";
import React from "react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { usePrivy } from "@privy-io/react-auth";
import { truncateAddress } from "@/utils/truncateAddress";
import { RequestButton } from "./requestPopup";
import { IncreaseAllowance } from "./increaseAllowance";
import { useSelector } from "react-redux";
import { InfoIcon } from "lucide-react";
import { ChangeContractAddress } from "./changeContractAddressPopup";

const Header = ({ w0, balanceOfEncryptedErc20, balanceOfDeafaultErc20 }) => {
  const { logout } = usePrivy();
  return (
    <div className="w-full flex items-center justify-between p-8 bg-white">
      <div className="flex items-center gap-3">
        <Image src={"/logo.svg"} width={40} height={40} />
        <p className="font-bold text-4xl">Inco Pay</p>
      </div>

      <div className="flex items-center gap-4">
        {/* <IncreaseAllowance w0={w0} /> */}
        <RequestButton
          balanceOfDeafaultErc20={balanceOfDeafaultErc20}
          w0={w0}
          balanceOfEncryptedErc20={balanceOfEncryptedErc20}
        />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            {w0.address && (
              <Button variant="outline" className="rounded-full">
                {truncateAddress(w0.address, 4, 4)}
              </Button>
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {/* <DropdownMenuLabel>Actions</DropdownMenuLabel> */}
            <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex h-full items-center cursor-pointer">
          <ChangeContractAddress />
        </div>
      </div>
    </div>
  );
};

export default Header;
