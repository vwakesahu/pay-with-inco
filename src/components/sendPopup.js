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

export function SendButton({ w0 }) {
  const [open, setOpen] = useState(false);
  const [receiverAddress, setReceiverAddress] = useState("");
  const [value, setValue] = useState(0);
  const handleAddTransaction = async (e) => {
    e.preventDefault();
    const transaction = {
      type: "sent",
      value: value,
      status: "success",
      activity: `sending money to ${receiverAddress}`,
      addresses: w0.address,
      receiverAddress: receiverAddress,
    };

    await addTransaction(transaction);
  };

  return (
    <AlertDialog open={open} onOpenChange={(e) => setOpen(e)}>
      <AlertDialogTrigger asChild>
        <Button className="w-full min-w-[17rem] max-w-[20rem] mt-2">
          Send
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Send Tokens</AlertDialogTitle>
          <AlertDialogDescription>
            This action is irreversible. Proceeding will permanently transfer
            your ERC20 tokens from your account to the specified recipient&apos;s
            account.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Input
          placeholder="Recipient's Address. eg.: 0x4557..65"
          value={receiverAddress}
          onChange={(e) => setReceiverAddress(e.target.value)}
        />
        <Input
          placeholder="Tokens to be sent"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={(e) => handleAddTransaction(e)}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

const sampleData = [
  {
    type: "sent",
    value: -51245,
    status: "success",
    activity: "sending money to 0x24a...245f",
    addresses: "0xb5e88d0A8a5100024B5606cf2BCB85Abdb85AF06",
    date: "Aug 28, 2023 3:40PM",
  },
  {
    type: "received",
    value: 45620,
    status: "success",
    activity: "sending money to 0x24a...245f",
    addresses: "0xc6377415E...750FC",
    date: "Aug 28, 2023 3:40PM",
  },
  {
    type: "sent",
    value: -51245,
    status: "success",
    activity: "sending money to 0x24a...245f",
    addresses: "0xc6377415E...750FC",
    date: "Aug 28, 2023 3:40PM",
  },
  {
    type: "sent",
    value: -51245,
    status: "success",
    activity: "sending money to 0x24a...245f",
    addresses: "0xc6377415E...750FC",
    date: "Aug 28, 2023 3:40PM",
  },
  {
    type: "sent",
    value: -51245,
    status: "success",
    activity: "sending money to 0x24a...245f",
    addresses: "0xc6377415E...750FC",
    date: "Aug 28, 2023 3:40PM",
  },
];
