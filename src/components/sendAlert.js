import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function TokenTransferRulesAlert() {
  return (
    <Alert variant="warning">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Token Transfer Rules</AlertTitle>
      <AlertDescription>
        <ul className="list-disc pl-5 mt-2">
          <li>Same country transfers: Uncapped</li>
          <li>Different country transfers: Capped at 10,000 tokens</li>
          <li>Blacklisted users: Cannot transfer or receive tokens</li>
        </ul>
      </AlertDescription>
    </Alert>
  );
}
