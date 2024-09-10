import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function TokenTransferRulesAlert() {
  return (
    <Alert variant="warning" className="mt-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Token Transfer Rules</AlertTitle>
      <AlertDescription>
        Same country transfers are uncapped, transfers are capped at{" "}
        <span className="font-semibold">10,000</span> tokens between different countries, and blacklisted
        users cannot transfer or receive tokens
      </AlertDescription>
    </Alert>
  );
}
