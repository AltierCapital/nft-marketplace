"use client";

import { Container } from "@/components/layout/container";
import { Skeleton } from "@/components/skeleton";
import { TOAST_CONFIG } from "@/components/toast-config";
import {
  ETHERSCAN_URL,
  MARKETPLACE_ADDRESS,
  NFT_COLLECTION_ADDRESS,
} from "@/thirdweb/contract-addresses";
import { getRandomColor } from "@/utils/get-random-color";
import {
  MediaRenderer,
  ThirdwebNftMedia,
  Web3Button,
  useContract,
  useContractEvents,
  useValidDirectListings,
  useValidEnglishAuctions,
} from "@thirdweb-dev/react";
import { NFT, SmartContract } from "@thirdweb-dev/sdk";
import { BaseContract } from "ethers";
import Link from "next/link";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import styles from "./token.module.css";

const [randomColor1, randomColor2] = [getRandomColor(), getRandomColor()];

type Props = {
  nft: NFT;
  contractMetadata: Awaited<
    ReturnType<SmartContract<BaseContract>["metadata"]["get"]>
  >;
};

export const TokenPageContent = ({ nft, contractMetadata }: Props) => {
  const [bidValue, setBidValue] = useState<string>();

  // Connect to marketplace smart contract
  const { contract: marketplace, isLoading: loadingContract } = useContract(
    MARKETPLACE_ADDRESS,
    "marketplace-v3",
  );

  // Connect to NFT Collection smart contract
  const { contract: nftCollection } = useContract(NFT_COLLECTION_ADDRESS);

  const { data: directListing, isLoading: loadingDirect } =
    useValidDirectListings(marketplace, {
      tokenContract: NFT_COLLECTION_ADDRESS,
      tokenId: nft.metadata.id,
    });

  // 2. Load if the NFT is for auction
  const { data: auctionListing, isLoading: loadingAuction } =
    useValidEnglishAuctions(marketplace, {
      tokenContract: NFT_COLLECTION_ADDRESS,
      tokenId: nft.metadata.id,
    });

  // Load historical transfer events
  const { data: transferEvents, isLoading: _loadingTransferEvents } =
    useContractEvents(nftCollection, "Transfer", {
      queryFilter: {
        filters: {
          tokenId: nft.metadata.id,
        },
        order: "desc",
      },
    });

  async function createBidOrOffer() {
    let txResult;
    if (!bidValue) {
      toast("Please enter a bid value", {
        icon: "❌",
        style: TOAST_CONFIG,
        position: "bottom-center",
      });
      return;
    }

    if (auctionListing?.[0]) {
      txResult = await marketplace?.englishAuctions.makeBid(
        auctionListing[0].id,
        bidValue,
      );
    } else if (directListing?.[0]) {
      txResult = await marketplace?.offers.makeOffer({
        assetContractAddress: NFT_COLLECTION_ADDRESS,
        tokenId: nft.metadata.id,
        totalPrice: bidValue,
      });
    } else {
      throw new Error("No valid listing found for this NFT");
    }

    return txResult;
  }

  async function buyListing() {
    let txResult;

    if (auctionListing?.[0]) {
      txResult = await marketplace?.englishAuctions.buyoutAuction(
        auctionListing[0].id,
      );
    } else if (directListing?.[0]) {
      txResult = await marketplace?.directListings.buyFromListing(
        directListing[0].id,
        1,
      );
    } else {
      throw new Error("No valid listing found for this NFT");
    }
    return txResult;
  }

  return (
    <>
      <Toaster position="bottom-center" reverseOrder={false} />
      <Container maxWidth="lg">
        {" "}
        <div className={styles.container}>
          <div className={styles.metadataContainer}>
            <ThirdwebNftMedia
              metadata={nft.metadata}
              className={styles.image}
            />

            <div className={styles.descriptionContainer}>
              <h3 className={styles.descriptionTitle}>Description</h3>
              <p className={styles.description}>{nft.metadata.description}</p>

              <h3 className={styles.descriptionTitle}>Traits</h3>

              <div className={styles.traitsContainer}>
                {Object.entries(nft?.metadata?.attributes || {}).map(
                  ([key, value]) => (
                    <div className={styles.traitContainer} key={key}>
                      <p className={styles.traitName}>{key}</p>
                      <p className={styles.traitValue}>
                        {value?.toString() || ""}
                      </p>
                    </div>
                  ),
                )}
              </div>

              <h3 className={styles.descriptionTitle}>History</h3>

              <div className={styles.traitsContainer}>
                {transferEvents?.map((event, index) => (
                  <div
                    key={event.transaction.transactionHash}
                    className={styles.eventsContainer}
                  >
                    <div className={styles.eventContainer}>
                      <p className={styles.traitName}>Event</p>
                      <p className={styles.traitValue}>
                        {
                          // if last event in array, then it's a mint
                          index === transferEvents.length - 1
                            ? "Mint"
                            : "Transfer"
                        }
                      </p>
                    </div>

                    <div className={styles.eventContainer}>
                      <p className={styles.traitName}>From</p>
                      <p className={styles.traitValue}>
                        {event.data.from?.slice(0, 4)}...
                        {event.data.from?.slice(-2)}
                      </p>
                    </div>

                    <div className={styles.eventContainer}>
                      <p className={styles.traitName}>To</p>
                      <p className={styles.traitValue}>
                        {event.data.to?.slice(0, 4)}...
                        {event.data.to?.slice(-2)}
                      </p>
                    </div>

                    <div className={styles.eventContainer}>
                      <Link
                        className={styles.txHashArrow}
                        href={`${ETHERSCAN_URL}/tx/${event.transaction.transactionHash}`}
                        target="_blank"
                      >
                        ↗
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.listingContainer}>
            {contractMetadata && (
              <div className={styles.contractMetadataContainer}>
                <MediaRenderer
                  src={contractMetadata.image}
                  className={styles.collectionImage}
                />
                <p className={styles.collectionName}>{contractMetadata.name}</p>
              </div>
            )}
            <h1 className={styles.title}>{nft.metadata.name}</h1>
            <p className={styles.collectionName}>Token ID #{nft.metadata.id}</p>

            <Link
              href={`/profile/${nft.owner}`}
              className={styles.nftOwnerContainer}
            >
              {/* Random linear gradient circle shape */}
              <div
                className={styles.nftOwnerImage}
                style={{
                  background: `linear-gradient(90deg, ${randomColor1}, ${randomColor2})`,
                }}
              />
              <div className={styles.nftOwnerInfo}>
                <p className={styles.label}>Current Owner</p>
                <p className={styles.nftOwnerAddress}>
                  {nft.owner.slice(0, 8)}...{nft.owner.slice(-4)}
                </p>
              </div>
            </Link>

            <div className={styles.pricingContainer}>
              {/* Pricing information */}
              <div className={styles.pricingInfo}>
                <p className={styles.label}>Price</p>
                <div className={styles.pricingValue}>
                  {loadingContract || loadingDirect || loadingAuction ? (
                    <Skeleton width="120" height="24" />
                  ) : (
                    <>
                      {directListing?.[0] ? (
                        <>
                          {directListing[0]?.currencyValuePerToken.displayValue}{" "}
                          {directListing[0]?.currencyValuePerToken.symbol}
                        </>
                      ) : auctionListing?.[0] ? (
                        <>
                          {auctionListing[0]?.buyoutCurrencyValue.displayValue}{" "}
                          {auctionListing[0]?.buyoutCurrencyValue.symbol}
                        </>
                      ) : (
                        "Not for sale"
                      )}
                    </>
                  )}
                </div>

                <div>
                  {loadingAuction ? (
                    <Skeleton width="120" height="24" />
                  ) : (
                    <>
                      {auctionListing?.[0] && (
                        <>
                          <p className={styles.label} style={{ marginTop: 12 }}>
                            Bids starting from
                          </p>

                          <div className={styles.pricingValue}>
                            {
                              auctionListing[0]?.minimumBidCurrencyValue
                                .displayValue
                            }{" "}
                            {auctionListing[0]?.minimumBidCurrencyValue.symbol}
                          </div>
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>

            {loadingContract || loadingDirect || loadingAuction ? (
              <Skeleton width="100%" height="164" />
            ) : (
              <>
                <Web3Button
                  contractAddress={MARKETPLACE_ADDRESS}
                  action={async () => await buyListing()}
                  className={styles.btn}
                  onSuccess={() => {
                    toast("Purchase success!", {
                      icon: "✅",
                      style: TOAST_CONFIG,
                      position: "bottom-center",
                    });
                  }}
                  onError={(e) => {
                    toast(`Purchase failed! Reason: ${e.message}`, {
                      icon: "❌",
                      style: TOAST_CONFIG,
                      position: "bottom-center",
                    });
                  }}
                >
                  Buy at asking price
                </Web3Button>

                <div className={`${styles.listingTimeContainer} ${styles.or}`}>
                  <p className={styles.listingTime}>or</p>
                </div>

                <input
                  className={styles.input}
                  defaultValue={
                    auctionListing?.[0]?.minimumBidCurrencyValue
                      ?.displayValue || 0
                  }
                  type="number"
                  step={0.000001}
                  onChange={(e) => {
                    setBidValue(e.target.value);
                  }}
                />

                <Web3Button
                  contractAddress={MARKETPLACE_ADDRESS}
                  action={async () => await createBidOrOffer()}
                  className={styles.btn}
                  onSuccess={() => {
                    toast("Bid success!", {
                      icon: "✅",
                      style: TOAST_CONFIG,
                      position: "bottom-center",
                    });
                  }}
                  onError={(e) => {
                    console.log(e);
                    toast(`Bid failed! Reason: ${e.message}`, {
                      icon: "❌",
                      style: TOAST_CONFIG,
                      position: "bottom-center",
                    });
                  }}
                >
                  Place bid
                </Web3Button>
              </>
            )}
          </div>
        </div>
      </Container>
    </>
  );
};
