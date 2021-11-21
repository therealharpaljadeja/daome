import { useState, useContext } from "react";
import CustomModal from "./CustomModal";
import { ethers } from "ethers";
import { VStack, Input, Text } from "@chakra-ui/react";
import { Web3Context } from "../context/Web3Context";
import { NFTMarketContext } from "../context/NFTMarketContext";

function SellNFTModal({ isOpen, onClose, name, collectionAddress, tokenId }) {
	const [price, setPrice] = useState(0);

	const nftMarketContext = useContext(NFTMarketContext);
	const { creatingMarketItem, createMarketItemUsingSigner } =
		nftMarketContext;

	const handleInputChange = ({ target }) => {
		setPrice(target.value);
	};

	const handleSell = async () => {
		let priceInWei = ethers.utils.parseUnits(price, "ether");
		console.log("creating sale!");
		createMarketItemUsingSigner(collectionAddress, tokenId, priceInWei);
	};

	return (
		<CustomModal
			isOpen={isOpen}
			onClose={onClose}
			modalCloseButton={true}
			modalHeader={`Sell ${name}`}
			modalFooterButtonText="Sell"
			modalButtonLoadingState={creatingMarketItem}
			modalButtonOnClick={handleSell}
		>
			<VStack spacing={5} px="60px">
				<Input
					onChange={handleInputChange}
					value={price}
					size="lg"
					variant="unstyled"
					textAlign="center"
					fontSize="3xl"
					placeholder="0"
				/>
				<Text>${process.env.REACT_APP_CURRENCY_TICKER}</Text>
				<VStack>
					<Text>
						Listing Fee: 0.025 $
						{process.env.REACT_APP_CURRENCY_TICKER}
					</Text>
					<Text>
						List for {parseFloat(price) - 0.025} $
						{process.env.REACT_APP_CURRENCY_TICKER}
					</Text>
					{/* <CgArrowsExchange />  */}
				</VStack>
			</VStack>
		</CustomModal>
	);
}
export default SellNFTModal;
