"use client";

import { Container } from "@/components/layout/container";
import { NFTGrid } from "@/components/nft-grid";
import { SaleInfo } from "@/components/sale-info";
import { NFT_COLLECTION_ADDRESS } from "@/thirdweb/contract-addresses";
import {
  ThirdwebNftMedia,
  useAddress,
  useContract,
  useOwnedNFTs,
} from "@thirdweb-dev/react";
import type { NFT } from "@thirdweb-dev/sdk";
import { useState } from "react";
import styles from "./sell-page.module.css";

export default function SellPage() {
  // Load all of the NFTs from the NFT Collection
  const { contract } = useContract(NFT_COLLECTION_ADDRESS);
  const address = useAddress();
  const { data, isLoading } = useOwnedNFTs(contract, address);

  const [selectedNft, setSelectedNft] = useState<NFT>();

  return (
    <Container maxWidth="lg">
      <h1>Sell NFTs</h1>
      {selectedNft ? (
        <div className={styles.container} style={{ marginTop: 0 }}>
          <div className={styles.metadataContainer}>
            <div className={styles.imageContainer}>
              <ThirdwebNftMedia
                metadata={selectedNft.metadata}
                className={styles.image}
              />
              <button
                type="button"
                onClick={() => {
                  setSelectedNft(undefined);
                }}
                className={styles.crossButton}
              >
                X
              </button>
            </div>
          </div>

          <div className={styles.listingContainer}>
            <p>You&rsquo;re about to list the following item for sale.</p>
            <h1 className={styles.title}>{selectedNft.metadata.name}</h1>
            <p className={styles.collectionName}>
              Token ID #{selectedNft.metadata.id}
            </p>

            <div className={styles.pricingContainer}>
              <SaleInfo nft={selectedNft} />
            </div>
          </div>
        </div>
      ) : (
        <>
          <p>Select which NFT you&rsquo;d like to sell below.</p>
          <NFTGrid
            data={data}
            isLoading={isLoading}
            overrideOnclickBehavior={(nft) => {
              setSelectedNft(nft);
            }}
            emptyText={
              "Looks like you don't own any NFTs in this collection. Head to the buy page to buy some!"
            }
          />
        </>
      )}
    </Container>
  );
}
