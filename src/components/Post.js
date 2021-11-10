import { VStack, Image } from "@chakra-ui/react";
import ExpandedPostBody from "./ExpandedPostBody";
import PostBody from "./PostBody";
import PostHeader from "./PostHeader";

function Post({ isExpanded, nft, id }) {
    console.log(nft);
    return (
        <VStack width="100%">
            <PostHeader profilePicUrl={nft.creator.profilePicUrl} name={nft.creator.name} />            
            <Image marginTop="0px !important" width="100%" height="100%" src={nft.image} />
            {
                isExpanded ?
                <ExpandedPostBody name={nft.name} tokenId={id} isApprovedByOwner={nft.isApprovedByOwner} seller={nft.seller} collectionAddress={nft.collectionAddress} owner={nft.owner} price={nft.price} bio={nft.description} />
                :
                <PostBody name={nft.name} tokenId={id} isApprovedByOwner={nft.isApprovedByOwner} collectionAddress={nft.collectionAddress} seller={nft.seller} owner={nft.owner} price={nft.price} bio={nft.description} />
            }
        </VStack>
    );
}

export default Post;