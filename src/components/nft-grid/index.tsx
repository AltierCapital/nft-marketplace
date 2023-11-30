import { NFTCard } from "@/components/nft-grid/nft-card";
import { Skeleton } from "@/components/skeleton";
import { NFT_COLLECTION_ADDRESS } from "@/thirdweb/contract-addresses";
import type { NFT } from "@thirdweb-dev/sdk";
import Link from "next/link";
import styles from "./nft-grid.module.css";

const EMPTY_ARRAY = [...Array(20)].map((_, index) => index);

type Props = {
  isLoading: boolean;
  data: NFT[] | undefined;
  overrideOnclickBehavior?: (nft: NFT) => void;
  emptyText?: string;
};

export const NFTGrid = ({
  isLoading,
  data,
  overrideOnclickBehavior,
  emptyText = "No NFTs found for this collection.",
}: Props) => {
  if (isLoading) {
    return (
      <div className={styles.nftGridContainer}>
        {EMPTY_ARRAY.map((index) => (
          <div key={index} className={styles.nftContainer}>
            <Skeleton key={index} width={"100%"} height="312px" />
          </div>
        ))}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className={styles.nftGridContainer}>
        <p>{emptyText}</p>
      </div>
    );
  }

  return (
    <div className={styles.nftGridContainer}>
      {data.map((nft) =>
        overrideOnclickBehavior ? (
          <div
            key={nft.metadata.id}
            className={styles.nftContainer}
            onClick={() => overrideOnclickBehavior(nft)}
            onKeyDown={() => overrideOnclickBehavior(nft)}
          >
            <NFTCard nft={nft} />
          </div>
        ) : (
          <Link
            href={`/token/${NFT_COLLECTION_ADDRESS}/${nft.metadata.id}`}
            key={nft.metadata.id}
            className={styles.nftContainer}
          >
            <NFTCard nft={nft} />
          </Link>
        ),
      )}
    </div>
  );
};
