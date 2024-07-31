import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePrivy } from "@privy-io/react-auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Login() {
  const { login } = usePrivy();
  const [selectedUser, setSelectedUser] = useState("beneficiary");
  const router = useRouter();

  const handleLogin = () => {
    if (selectedUser === "admin") {
      login();
      router.push("/owner");
    } else {
      login();
      router.push("/");
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center p-3.5">
      <main className="flex flex-col items-center gap-y-9">
        <div className="max-w-lg space-y-3.5 text-center">
          <h1 className="text-5xl font-semibold tracking-tight md:text-7xl">
            Pay with Inco
          </h1>
          <p className="md:text-balance text-muted-foreground md:text-xl">
            Prototype to Demonstrate Confidential ERC20 Transfers Using Inco
            Network. Connect your wallet to get started.
          </p>
        </div>
        <div className="flex items-center gap-3.5">
          <DropdownMenu>
            <DropdownMenuTrigger className="bg-white px-3 py-2 rounded-lg border capitalize">
              {selectedUser || "Select User"}
            </DropdownMenuTrigger>
            <DropdownMenuContent
              value={selectedUser}
              onValueChange={setSelectedUser}
            >
              <DropdownMenuItem onSelect={() => setSelectedUser("admin")}>
                Admin
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setSelectedUser("beneficiary")}>
                Beneficiary
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button onClick={handleLogin}>Connect Wallet</Button>
        </div>
      </main>

      <footer className="absolute bottom-3.5 mx-auto flex items-center gap-[0.5ch] text-center text-muted-foreground">
        <span>Powered by</span>
        <Link
          href="https://www.inco.org/"
          target="_blank"
          className="group flex items-center text-primary font-semibold gap-[0.5ch] underline-offset-4 hover:underline"
        >
          Inco Network.
        </Link>
      </footer>
    </div>
  );
}
