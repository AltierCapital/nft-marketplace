import { TokenPageContent } from "@/app/token/[contractAddress]/[tokenId]/content";
import { thirdwebClient } from "@/thirdweb/client";
import { NFT_COLLECTION_ADDRESS } from "@/thirdweb/contract-addresses";

type Props = {
  params: {
    readonly contractAddress: string;
    readonly tokenId: string;
  };
};

export const generateStaticParams = async (): Promise<Props["params"][]> => {
  const contract = await thirdwebClient.getContract(NFT_COLLECTION_ADDRESS);
  const nfts = await contract.erc721.getAll();
  return nfts.map((nft) => {
    return {
      contractAddress: NFT_COLLECTION_ADDRESS,
      tokenId: nft.metadata.id,
    };
  });
};

export default async function TokenPage({ params }: Props) {
  const contract = await thirdwebClient.getContract(NFT_COLLECTION_ADDRESS);
  const nft = await contract.erc721.get(params?.tokenId);
  const contractMetadata = await contract.metadata.get();

  return <TokenPageContent nft={nft} contractMetadata={contractMetadata} />;
}
