import Image from "next/image";
import React from "react";
import { Button } from "./ui/button";

const Header = () => {
  return (
    <div className="w-full flex items-center justify-between p-8">
      <Image src={"/logo.svg"} width={230} height={30} />
      <Button className="rounded-full">0xab45...457</Button>
    </div>
  );
};

export default Header;
