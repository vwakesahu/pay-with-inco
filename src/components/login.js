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
import Image from "next/image";

export default function Login() {
  const { login } = usePrivy();
  // const [selectedUser, setSelectedUser] = useState("beneficiary");
  const router = useRouter();

  const handleLogin = (selectedUser) => {
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
        <div className="w-[48rem] space-y-10 text-center">
          {/* <h1 className="text-5xl font-semibold tracking-tight md:text-7xl">
            Pay with Inco
          </h1> */}
          <Image src={"/logoT.svg"} width={200} height={200} />
          <div className="w-full grid grid-cols-2 gap-10">
            <div className="bg-white rounded-2xl grid place-items-center p-8">
              <div className="grid gap-6 place-items-center">
                <Image src={"/icons/hero1.svg"} width={160} height={160} />
                <p className="font-semibold text-2xl">Admin</p>
                <Button onClick={() => handleLogin("admin")}>Connect</Button>
              </div>
            </div>
            <div className="bg-white rounded-2xl grid place-items-center p-8">
              <div className="grid gap-6 place-items-center">
                <div className="h-[160px] grid place-items-center">
                  <Image src={"/icons/hero2.svg"} width={160} height={160} />
                </div>

                <p className="font-semibold text-2xl">Beneficiary</p>
                <Button onClick={() => handleLogin("")}>Connect</Button>
              </div>
            </div>
          </div>
          <p className="text-muted-foreground w-full flex items-center justify-start">
            *This is a POC for showcasing the Inco payment system integration.
          </p>
        </div>
        {/* <div className="flex items-center gap-3.5">
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
        </div> */}
      </main>

      {/* <footer className="absolute bottom-3.5 mx-auto flex items-center gap-[0.5ch] text-center text-muted-foreground">
        <span>Powered by</span>
        <Link
          href="https://www.inco.org/"
          target="_blank"
          className="group flex items-center text-primary font-semibold gap-[0.5ch] underline-offset-4 hover:underline"
        >
          Inco Network.
        </Link>
      </footer> */}
    </div>
  );
}
