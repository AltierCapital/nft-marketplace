import { NETWORK } from "@/thirdweb/contract-addresses";
import { ThirdwebSDK } from "@thirdweb-dev/sdk";

export const thirdwebClient = new ThirdwebSDK(NETWORK, {
  secretKey: process.env.TW_SECRET_KEY,
});
