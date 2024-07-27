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

const Header = ({ w0 }) => {
  const { logout } = usePrivy();
  return (
    <div className="w-full flex items-center justify-between p-8">
      <Image src={"/logo.svg"} width={230} height={30} />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          {w0.address && (
            <Button className="rounded-full">
              {truncateAddress(w0.address, 4, 4)}
            </Button>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {/* <DropdownMenuLabel>Actions</DropdownMenuLabel> */}
          <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default Header;
