import { Navbar } from "@/components/layout/navbar";
import { fonts } from "@/fonts/google";
import "@/styles/globals.css";
import { NETWORK } from "@/thirdweb/contract-addresses";
import { cn } from "@/utils/classnames";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { AppProps } from "next/app";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThirdwebProvider
      clientId={process.env.NEXT_PUBLIC_TEMPLATE_CLIENT_ID}
      activeChain={NETWORK}
    >
      <main
        className={cn(
          "flex min-w-0 flex-auto flex-col font-sans antialiased",
          fonts,
        )}
      >
        {/* Render the navigation menu above each component */}
        <Navbar />
        {/* Render the actual component (page) */}
        <Component {...pageProps} />
      </main>
    </ThirdwebProvider>
  );
}
