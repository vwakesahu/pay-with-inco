import { useWallets } from "@privy-io/react-auth";
import React, { useState } from "react";
import Header from "./header";
import Navbar from "./navbar";
import { ConfigureMint } from "./configureMint";

const OwnerPage = () => {
  const { wallets } = useWallets();
  const w0 = wallets[0];
  return (
    <div>
      {w0 && (
        <>
          <Header w0={w0} />
          {/* <Navbar /> */}
          <ConfigureMint w0={w0} />
        </>
      )}
    </div>
  );
};

export default OwnerPage;
