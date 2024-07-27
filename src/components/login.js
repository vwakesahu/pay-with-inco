import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { usePrivy } from "@privy-io/react-auth";

export default function Login() {
  const { login } = usePrivy();
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center p-3.5">
      <main className="flex flex-col items-center gap-y-9">
        <div className="max-w-lg space-y-3.5 text-center">
          <h1 className="text-5xl font-semibold tracking-tight md:text-7xl">
            Pay with Inco
          </h1>
          <p className="md:text-balance text-muted-foreground md:text-xl">
            POC for showcasing the Inco payment system integration. Connect your
            wallet to get started.
          </p>
        </div>
        <div className="flex items-center gap-3.5">
          <Button onClick={login}>Connect Wallet</Button>
        </div>
      </main>

      <footer className="absolute bottom-3.5 mx-auto flex items-center gap-[0.5ch] text-center text-muted-foreground">
        <span>Powered by</span>
        <Link
          href="https://www.inco.org/"
          target="_blank"
          className="group flex items-center text-primary font-semibold gap-[0.5ch] underline-offset-4 hover:underline"
        >
          Inco Networks.
        </Link>
      </footer>
    </div>
  );
}
