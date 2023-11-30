import { NFTCard } from "@/components/nft-grid/nft-card";
import styles from "@/components/nft-grid/nft-grid.module.css";
import { Skeleton } from "@/components/skeleton";
import { NFT_COLLECTION_ADDRESS } from "@/thirdweb/contract-addresses";
import { useContract, useNFT } from "@thirdweb-dev/react";
import { DirectListingV3, EnglishAuction } from "@thirdweb-dev/sdk";
import Link from "next/link";

type Props = {
  listing: DirectListingV3 | EnglishAuction;
};

/**
 * Accepts a listing and renders the associated NFT for it
 */
export const ListingWrapper = ({ listing }: Props) => {
  const { contract: nftContract } = useContract(NFT_COLLECTION_ADDRESS);
  const { data: nft, isLoading } = useNFT(nftContract, listing.asset.id);

  if (isLoading) {
    return (
      <div className={styles.nftContainer}>
        <Skeleton width={"100%"} height="312px" />
      </div>
    );
  }

  if (!nft) return null;

  return (
    <Link
      href={`/token/${NFT_COLLECTION_ADDRESS}/${nft.metadata.id}`}
      key={nft.metadata.id}
      className={styles.nftContainer}
    >
      <NFTCard nft={nft} />
    </Link>
  );
};
