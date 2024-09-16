import { Contract } from "ethers";
import { SendButton } from "./sendPopup";
import { identityRegistryABI } from "@/contract";
import {
  getInstance,
  getSignature,
  getTokenSignature,
  toHexString,
} from "@/utils/fhEVM";
import { CoinsIcon, MapPinIcon, PiggyBankIcon } from "lucide-react";
import { useEffect, useState } from "react";
import Loader from "./loader";
import { RequestButton } from "./requestPopup";
import BurnToken from "./burnPopup";
import { useSelector } from "react-redux";
import WrapToken from "./wrapToken";
import { usePrivy } from "@privy-io/react-auth";
import { countries } from "./adminDatatable";

const { default: Image } = require("next/image");
const { Button } = require("./ui/button");

export const Overview = ({
  balanceOfDeafaultErc20,
  normalBalanceLoadin,
  normalTokenBalance,
  w0,
  data,
  setData,
  balanceOfEncryptedErc20,
  balance,
  balanceLoading,
}) => {
  const { ready, authenticated } = usePrivy();
  const { identityRegistryContractAddress } = useSelector(
    (st) => st.identityRegistryContractAddress
  );
  const { erc20RulesContractAddress } = useSelector(
    (st) => st.erc20RulesContractAddress
  );

  // useEffect(() => {
  //   if (ready && authenticated && w0.address) getCountryDetails();
  // }, [w0, ready, authenticated]);

  // const getCountryDetails = async () => {
  //   try {
  //     // setLoading(true);
  //     const provider = await w0?.getEthersProvider();
  //     const signer = await provider?.getSigner();
  //     const countryDetailContract = new Contract(
  //       identityRegistryContractAddress,
  //       identityRegistryABI,
  //       signer
  //     );

  //     const fhevmInstance = await getInstance();
  //     const { signature, publicKey } = await getSignature(
  //       identityRegistryContractAddress,
  //       w0.address,
  //       fhevmInstance
  //     );

  //     console.log(signature);
  //     console.log(toHexString(publicKey));
  //     const aj = await countryDetailContract.myCountry(publicKey, signature);
  //     console.log(aj);
  //     const decrptedCountry = await fhevmInstance
  //       .decrypt(identityRegistryContractAddress, aj)
  //       .toString();

  //     console.log(decrptedCountry);

  //     // const country = await countryDetailContract.seeCountry(w0.address);
  //     // console.log("Country from blockchain:", country.toString());

  //     // const foundCountry = countries.find(
  //     //   (c) =>
  //     //     c.code === country ||
  //     //     c.name === country ||
  //     //     c.sendValue.toString() === country.toString()
  //     // );
  //     // if (foundCountry) {
  //     //   setCountryCode(foundCountry.code);
  //     //   setCountryName(foundCountry.name);
  //     // } else {
  //     //   setError("Country not found in the list");
  //     // }
  //   } catch (err) {
  //     console.error("Error fetching country details:", err);
  //     // setError("Failed to fetch country details");
  //   }
  // };
  return (
    // <button onClick={getCountryDetails}>jxdhbvjb dx</button>
    <div className="mt-8 px-8">
      <p className="text-3xl font-semibold">Overview</p>
      <div className="mt-8 p-4 py-6 bg-white rounded-lg flex drop-shadow-sm">
        <Image src={"/icons/hero.svg"} width={305} height={247} />
        <div className="w-full grid grid-cols-3">
          <div className="border-r w-full flex  items-center justify-center">
            <div>
              <div className="flex items-center gap-3">
                <Image src="/icons/lock.svg" width={16} height={16} />
                <p className="font-medium text-[#71737F]">cUSDC Balance</p>
              </div>

              <div>
                {balanceLoading ? (
                  <div className="h-28 grid place-items-center">
                    <Loader />
                  </div>
                ) : (
                  <div className="flex items-center mt-1">
                    <div className="text-7xl font-semibold text-primary">
                      {balance}
                    </div>
                    {/* <div className="text-8xl font-semibold text-primary">$</div> */}
                  </div>
                )}

                <div className="flex items-center gap-4 mt-4">
                  <SendButton
                    balance={balance}
                    w0={w0}
                    data={data}
                    setData={setData}
                    balanceOfEncryptedErc20={balanceOfEncryptedErc20}
                  />
                  <BurnToken
                    data={data}
                    setData={setData}
                    balance={balance}
                    w0={w0}
                    balanceOfEncryptedErc20={balanceOfEncryptedErc20}
                    balanceOfDeafaultErc20={balanceOfDeafaultErc20}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="w-full flex border-r  items-center px-14">
            <div>
              <div className="flex items-center gap-3">
                <Image src="/icons/unlock.svg" width={16} height={16} />
                <p className="font-medium text-[#71737F]">USDC Balance</p>
              </div>

              {normalBalanceLoadin ? (
                <div className="h-28 grid place-items-center">
                  <Loader />
                </div>
              ) : (
                <div className="flex items-center mt-1">
                  <div className="text-7xl font-semibold text-primary">
                    {normalTokenBalance}
                  </div>
                  {/* <div className="text-8xl font-semibold text-primary">$</div> */}
                </div>
              )}
              <div>
                <WrapToken
                  w0={w0}
                  setData={setData}
                  balance={normalTokenBalance}
                  balanceOfDeafaultErc20={balanceOfDeafaultErc20}
                  balanceOfEncryptedErc20={balanceOfEncryptedErc20}
                />
              </div>
            </div>
          </div>
          {/* <Button
            variant="outline"
            className="bg-[#EEEEEE]"
            onClick={getcountrydetails}
          >
            call
          </Button> */}
          <div className="w-full flex  items-center px-14">
            {/* Country Image */}
            <UserCountryDisplay w0={w0} />
          </div>
        </div>
      </div>
    </div>
  );
};

const UserCountryDisplay = ({ w0 }) => {
  const { identityRegistryContractAddress } = useSelector(
    (st) => st.identityRegistryContractAddress
  );
  const [countryCode, setCountryCode] = useState("");
  const [countryName, setCountryName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showFlag, setShowFlag] = useState(false); // State to show flag after button click
  const { ready, authenticated } = usePrivy();

  useEffect(() => {
    setShowFlag(false);
  }, [w0]);

  const getCountryDetails = async () => {
    try {
      setLoading(true);
      const provider = await w0?.getEthersProvider();
      const signer = await provider?.getSigner();
      const countryDetailContract = new Contract(
        identityRegistryContractAddress,
        identityRegistryABI,
        signer
      );

      const fhevmInstance = await getInstance();
      const { signature, publicKey } = await getSignature(
        identityRegistryContractAddress,
        w0.address,
        fhevmInstance
      );

      const aj = await countryDetailContract.myCountry(
        w0.address,
        publicKey,
        signature
      );
      console.log(aj);
      const decryptedCountry = fhevmInstance
        .decrypt(identityRegistryContractAddress, aj)
        .toString();

      // Match the sendValue (decryptedCountry) to the country array
      const foundCountry = countries.find(
        (country) => country.sendValue === Number(decryptedCountry)
      );

      if (foundCountry) {
        setCountryCode(foundCountry.code);
        setCountryName(foundCountry.name);
        setShowFlag(true); // Show flag once data is fetched
      } else {
        setError("Country not found in the list");
      }
    } catch (err) {
      console.error("Error fetching country details:", err);
      setError("Failed to fetch country details");
    } finally {
      setLoading(false);
    }
  };

  const handleClick = () => {
    if (ready && authenticated && w0?.address) {
      getCountryDetails();
    } else {
      setError("User not authenticated or provider unavailable");
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  const flagUrl = `https://flagsapi.com/${countryCode.toUpperCase()}/flat/64.png`;

  if (loading) {
    return (
      <div className="w-full h-full grid place-items-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="w-full">
      {showFlag ? (
        <div className="flex flex-col items-center justify-center h-full rounded-lg p-6 shadow-sm">
          <div className="relative w-20 h-20 mb-4">
            <img
              src={flagUrl}
              alt={`${countryName} flag`}
              className="w-full h-full object-cover rounded-full border-4 border-white shadow-md"
            />
          </div>
          <h3 className="text-2xl font-semibold text-primary mb-2">
            {countryName}
          </h3>
          <div className="flex items-center text-sm text-gray-600">
            <MapPinIcon className="w-4 h-4 mr-1" />
            <p>Your Associated Country</p>
          </div>
          <p className="text-xs text-gray-500 mt-4 text-center">
            Your transactions and activities are associated with this country.
          </p>
        </div>
      ) : (
        <div>
          <Button
            onClick={handleClick}
            className="flex flex-col items-center justify-center h-full w-full"
          >
            Show Country Flag
          </Button>
        </div>
      )}
    </div>
  );
};
