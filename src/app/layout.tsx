import { Navbar } from "@/components/layout/navbar";
import { fonts } from "@/fonts/google";
import "@/styles/globals.css";
import { ThirdwebProvider } from "@/thirdweb/provider";
import { cn } from "@/utils/classnames";
import type { Metadata } from "next";

const title = "NFT Marketplace";
const description = "By Altier Capital";
const url = "http://localhost:3000";

export const metadata: Metadata = {
  description,
  metadataBase: new URL(url),
  openGraph: {
    description,
    siteName: title,
    title,
    type: "website",
    url,
  },
  robots: {
    follow: true,
    googleBot: {
      follow: true,
      index: true,
    },
    index: true,
  },
  title: {
    default: title,
    template: `%s | ${title}`,
  },
};

const RootLayout = ({ children }: { readonly children: React.ReactNode }) => (
  <html lang="en" className={cn("min-w-[360px] scroll-smooth", fonts)}>
    <ThirdwebProvider>
      <body className="flex min-h-screen flex-1 flex-col font-sans antialiased">
        <main className="flex min-w-0 flex-auto flex-col">
          <Navbar />
          {children}
        </main>
      </body>
    </ThirdwebProvider>
  </html>
);

export default RootLayout;
