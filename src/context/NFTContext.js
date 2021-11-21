import React, { useContext, useState } from "react";
import {
	approveToMarketplace,
	mintNFT,
	tokenMetadata,
	tokenOwnedByUser,
	withdrawRoyalty,
} from "../utils/NFT";
import { Web3Context } from "./Web3Context";

export const NFTContext = React.createContext(null);

export function NFTContextProvider({ children }) {
	const web3Context = useContext(Web3Context);
	const { wallet } = web3Context;

	const [isMintingNFT, setIsMintingNFT] = useState(false);
	const [loadingNFT, setLoadingNFT] = useState(false);
	const [gettingMetadata, setGettingMetadata] = useState(null);
	const [approvingToMarketplace, setApprovingToMarketplace] = useState(false);
	const [withdrawingRoyalty, setWithdrawingRoyalty] = useState(false);

	async function mintNFTUsingSigner(tokenURI, royaltyPercentage) {
		setIsMintingNFT(true);
		await mintNFT(wallet, creatorAddress, tokenURI, royaltyPercentage);
		setIsMintingNFT(false);
	}

	async function getNFTsOwnerByUserUsingSigner() {
		setLoadingNFT(true);
		let result = await tokenOwnedByUser(wallet, creatorAddress);
		setCurrentUserNFTs(result);
		setLoadingNFT(false);
	}

	async function nftMetadataUsingSigner(
		creatorAddress,
		collectionAddress,
		tokenId
	) {
		setGettingMetadata(true);
		let nft = await tokenMetadata(
			wallet,
			creatorAddress,
			collectionAddress,
			tokenId
		);
		setGettingMetadata(false);
		return nft;
	}

	async function approveToMarketplaceUsingSigner(collectionAddress, tokenId) {
		setApprovingToMarketplace(true);
		try {
			await approveToMarketplace(wallet, collectionAddress, tokenId);
		} catch (e) {
			console.log(e);
		} finally {
			setApprovingToMarketplace(false);
		}
	}

	async function withdrawRoyaltyUsingSigner() {
		setWithdrawingRoyalty(true);
		withdrawRoyalty(creator.nftCollectionAddress, wallet);
		setWithdrawingRoyalty(false);
	}

	return (
		<NFTContext.Provider
			value={{
				isMintingNFT,
				loadingNFT,
				gettingMetadata,
				approvingToMarketplace,
				withdrawingRoyalty,
				mintNFTUsingSigner,
				getNFTsOwnerByUserUsingSigner,
				nftMetadataUsingSigner,
				approveToMarketplaceUsingSigner,
				withdrawRoyaltyUsingSigner,
			}}
		>
			{children}
		</NFTContext.Provider>
	);
}
