import React, { useState } from "react";
import { Contract } from "ethers";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { countries } from "./adminDatatable";
import { getInstance, getSignature } from "@/utils/fhEVM";
import { toast } from "sonner";

const CountrySelector = ({ w0, erc20RulesContractAddress, erc20RulesABI }) => {
  const [fromCountry, setFromCountry] = useState("");
  const [toCountry, setToCountry] = useState("");
  const [saveLoading, setSaveLoading] = useState(false);

  const handleSave = async () => {
    if (!fromCountry || !toCountry) {
      alert("Please select both from and to countries");
      return;
    }

    setSaveLoading(true);
    try {
      const provider = await w0?.getEthersProvider();
      const signer = await provider?.getSigner();
      const contract = new Contract(
        erc20RulesContractAddress,
        erc20RulesABI,
        signer
      );

      console.log(w0.address);
      const fhevmInstance = await getInstance();
      const encryptedFrom = fhevmInstance.encrypt32(fromCountry);
      const encryptedTo = fhevmInstance.encrypt32(toCountry);
      console.log(encryptedFrom, encryptedTo);
      console.log(fhevmInstance);
      console.log("fromCountry", fromCountry, " toCountry", toCountry);

      const txn = await contract.createPath(encryptedFrom, encryptedTo);
      await txn.wait(1);
      toast.success("Path created successfully!");
    } catch (error) {
      console.error("Error creating path:", error);
      toast.error("Error creating path.");
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <div className="w-full bg-white rounded-2xl text-xl mt-6">
      <div className="p-6">
        <div className="grid gap-2">
          <p className="font-semibold">Create Path Between Countries</p>
          <p className="text-sm text-muted-foreground">
            Select the source and destination countries to create a path.
          </p>
          <div className="flex items-center gap-6 mt-4 justify-between">
            <div className="flex items-center gap-6">
              <Select value={fromCountry} onValueChange={setFromCountry}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="From country" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country.code} value={country.sendValue}>
                      <div className="flex items-center">
                        <img
                          src={`https://flagsapi.com/${country.code}/flat/24.png`}
                          alt={`${country.name} flag`}
                          className="mr-2 h-4 w-6 object-cover"
                        />
                        {country.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={toCountry} onValueChange={setToCountry}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="To country" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country.code} value={country.sendValue}>
                      <div className="flex items-center">
                        <img
                          src={`https://flagsapi.com/${country.code}/flat/24.png`}
                          alt={`${country.name} flag`}
                          className="mr-2 h-4 w-6 object-cover"
                        />
                        {country.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handleSave} disabled={saveLoading}>
              {saveLoading ? (
                <div className="w-12 grid items-center justify-center">
                  <Loader2 className="animate-spin" />
                </div>
              ) : (
                "Create Path"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountrySelector;
