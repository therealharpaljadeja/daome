import { VStack, Spinner } from "@chakra-ui/react";
import Post from "../components/Post";
// import Comment from "../components/Comment";
// import Bid from "../components/Bid";
// import BidHeader from "../components/BidHeader";
import { useEffect, useContext, useState } from "react/cjs/react.development";
import { Web3Context } from "../context/Web3Context";
import { useParams } from "react-router-dom";

function PostPage() {
	const { creator, address, id } = useParams();

	const web3Context = useContext(Web3Context);
	const { gettingMetadata } = web3Context;
	const [nft, setNFT] = useState(null);

	useEffect(() => {
		const { provider, nftMetadataUsingSigner } = web3Context;
		(async () => {
			if (provider != null) {
				let nft = await nftMetadataUsingSigner(creator, address, id);
				console.log(nft);
				setNFT(nft);
			}
		})();
	}, [web3Context, address, creator, id]);

	return (
		<VStack spacing={0} alignItems="center" width="100%">
			{gettingMetadata === false ? (
				nft != null ? (
					<Post nft={nft} id={id} isExpanded={false} />
				) : null
			) : (
				<Spinner />
			)}
			{/* <Tabs isFitted width="100%">
                <TabList>
                    <Tab>Comments</Tab>
                    <Tab>Bids</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel>
                        <Comment />
                        <Comment />
                        <Comment />
                    </TabPanel>
                    <TabPanel padding={0}>
                        <BidHeader />
                        <VStack width="100%" padding={4}>
                            <Bid />
                        </VStack>
                    </TabPanel>
                </TabPanels>
            </Tabs> */}
		</VStack>
	);
}

export default PostPage;
