"use client";

import { NETWORK } from "@/thirdweb/contract-addresses";
import { ThirdwebProvider as NativeThirdwebProvider } from "@thirdweb-dev/react";
import { PropsWithChildren } from "react";

export const ThirdwebProvider = ({ children }: PropsWithChildren) => (
  <NativeThirdwebProvider
    clientId={process.env.NEXT_PUBLIC_TEMPLATE_CLIENT_ID}
    activeChain={NETWORK}
  >
    {children}
  </NativeThirdwebProvider>
);
