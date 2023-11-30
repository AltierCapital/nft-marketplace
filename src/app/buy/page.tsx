"use client";

import { Container } from "@/components/layout/container";
import { NFTGrid } from "@/components/nft-grid";
import { NFT_COLLECTION_ADDRESS } from "@/thirdweb/contract-addresses";
import { useContract, useNFTs } from "@thirdweb-dev/react";

export default function BuyPage() {
  // Load all of the NFTs from the NFT Collection
  const { contract } = useContract(NFT_COLLECTION_ADDRESS);
  const { data, isLoading } = useNFTs(contract);

  return (
    <Container maxWidth="lg">
      <h1>Buy NFTs</h1>
      <p>Browse which NFTs are available from the collection.</p>
      <NFTGrid
        data={data}
        isLoading={isLoading}
        emptyText={
          "Looks like there are no NFTs in this collection. Did you import your contract on the thirdweb dashboard? https://thirdweb.com/dashboard"
        }
      />
    </Container>
  );
}
