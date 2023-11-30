"use client";

import { Container } from "@/components/layout/container";
import { ListingWrapper } from "@/components/listing-wrapper";
import { NFTGrid } from "@/components/nft-grid";
import { Skeleton } from "@/components/skeleton";
import tabsStyles from "@/styles/tabs.module.css";
import {
  MARKETPLACE_ADDRESS,
  NFT_COLLECTION_ADDRESS,
} from "@/thirdweb/contract-addresses";
import { getRandomColor } from "@/utils/get-random-color";
import {
  useContract,
  useOwnedNFTs,
  useValidDirectListings,
  useValidEnglishAuctions,
} from "@thirdweb-dev/react";
import { useState } from "react";
import styles from "./profile.module.css";

const [randomColor1, randomColor2, randomColor3, randomColor4] = [
  getRandomColor(),
  getRandomColor(),
  getRandomColor(),
  getRandomColor(),
];

type Props = {
  params: {
    readonly address: string;
  };
};

export default function ProfilePage({ params }: Props) {
  const [tab, setTab] = useState<"nfts" | "listings" | "auctions">("nfts");

  const { contract: nftCollection } = useContract(NFT_COLLECTION_ADDRESS);

  const { contract: marketplace } = useContract(
    MARKETPLACE_ADDRESS,
    "marketplace-v3",
  );

  const { data: ownedNfts, isLoading: loadingOwnedNfts } = useOwnedNFTs(
    nftCollection,
    params.address,
  );

  const { data: directListings, isLoading: loadingDirects } =
    useValidDirectListings(marketplace, {
      seller: params.address,
    });

  const { data: auctionListings, isLoading: loadingAuctions } =
    useValidEnglishAuctions(marketplace, {
      seller: params.address,
    });

  return (
    <Container maxWidth="lg">
      <div>
        <div
          className={styles.coverImage}
          style={{
            background: `linear-gradient(90deg, ${randomColor1}, ${randomColor2})`,
          }}
        />
        <div
          className={styles.profilePicture}
          style={{
            background: `linear-gradient(90deg, ${randomColor3}, ${randomColor4})`,
          }}
        />
        <h1 className={styles.profileName}>
          {params.address ? (
            `${params.address.toString().substring(0, 4)}...${params.address
              .toString()
              .substring(38, 42)}`
          ) : (
            <Skeleton width="320" />
          )}
        </h1>
      </div>

      <div className={tabsStyles.tabs}>
        <h3
          className={`${tabsStyles.tab}
					${tab === "nfts" ? tabsStyles.activeTab : ""}`}
          onClick={() => setTab("nfts")}
          onKeyDown={() => setTab("nfts")}
        >
          NFTs
        </h3>
        <h3
          className={`${tabsStyles.tab}
					${tab === "listings" ? tabsStyles.activeTab : ""}`}
          onClick={() => setTab("listings")}
          onKeyDown={() => setTab("listings")}
        >
          Listings
        </h3>
        <h3
          className={`${tabsStyles.tab}
					${tab === "auctions" ? tabsStyles.activeTab : ""}`}
          onClick={() => setTab("auctions")}
          onKeyDown={() => setTab("auctions")}
        >
          Auctions
        </h3>
      </div>

      <div
        className={`${
          tab === "nfts" ? tabsStyles.activeTabContent : tabsStyles.tabContent
        }`}
      >
        <NFTGrid
          data={ownedNfts}
          isLoading={loadingOwnedNfts}
          emptyText="Looks like you don't have any NFTs from this collection. Head to the buy page to buy some!"
        />
      </div>

      <div
        className={`${
          tab === "listings"
            ? tabsStyles.activeTabContent
            : tabsStyles.tabContent
        }`}
      >
        {loadingDirects ? (
          <p>Loading...</p>
        ) : directListings && directListings.length === 0 ? (
          <p>Nothing for sale yet! Head to the sell tab to list an NFT.</p>
        ) : (
          directListings?.map((listing) => (
            <ListingWrapper listing={listing} key={listing.id} />
          ))
        )}
      </div>

      <div
        className={`${
          tab === "auctions"
            ? tabsStyles.activeTabContent
            : tabsStyles.tabContent
        }`}
      >
        {loadingAuctions ? (
          <p>Loading...</p>
        ) : auctionListings && auctionListings.length === 0 ? (
          <p>Nothing for sale yet! Head to the sell tab to list an NFT.</p>
        ) : (
          auctionListings?.map((listing) => (
            <ListingWrapper listing={listing} key={listing.id} />
          ))
        )}
      </div>
    </Container>
  );
}
