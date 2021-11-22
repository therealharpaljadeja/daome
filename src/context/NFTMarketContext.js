import React, { useState, useContext } from "react";
import {
	createMarketItem,
	createSale,
	fetchItemsCreated,
	fetchMarketItems,
	fetchMyNFTs,
	getMarketItemByItemId,
} from "../utils/NFTMarket";
import { Web3Context } from "./Web3Context";

export const NFTMarketContext = React.createContext(null);

export function NFTMarketContextProvider({ children }) {
	const web3Context = useContext(Web3Context);
	const { wallet } = web3Context;

	const [fetchingMarketItems, setFetchingMarketItems] = useState(false);
	const [currentUserNFTOnMarketplace, setCurrentUserNFTOnMarketplace] =
		useState(null);
	const [
		currentUserNFTsBoughtOnMarketplace,
		setCurrentUserNFTsBoughtOnMarketplace,
	] = useState(null);
	const [creatingMarketItem, setCreatingMarketItem] = useState(false);
	const [marketItems, setMarketItems] = useState(null);

	const [creatingMarketSale, setCreatingMarketSale] = useState(false);
	const [fetchingMyNFTs, setFetchingMyNFTs] = useState(false);
	const [fetchingItemsCreated, setFetchingItemsCreated] = useState(false);

	const [gettingItem, setGettingItem] = useState(false);

	async function fetchMarketItemsUsingSigner() {
		setFetchingMarketItems(true);
		let result = await fetchMarketItems(wallet);
		setMarketItems(result);
		setFetchingMarketItems(false);
	}

	async function fetchItemsCreatedUsingSigner() {
		setFetchingItemsCreated(true);
		let result = await fetchItemsCreated(wallet);
		setCurrentUserNFTOnMarketplace(result);
		setFetchingItemsCreated(false);
	}

	async function fetchMyNFTsUsingSigner() {
		setFetchingMyNFTs(true);
		let result = await fetchMyNFTs(wallet);
		setCurrentUserNFTsBoughtOnMarketplace(result);
		setFetchingMyNFTs(false);
	}

	async function createMarketItemUsingSigner(
		collectionAddress,
		tokenId,
		price
	) {
		setCreatingMarketItem(true);
		await createMarketItem(wallet, collectionAddress, tokenId, price);
		setCreatingMarketItem(false);
	}

	async function createSaleUsingSigner(collectionAddress, tokenId, price) {
		setCreatingMarketSale(true);
		await createSale(wallet, collectionAddress, tokenId, price);
		setCreatingMarketSale(false);
	}

	async function getMarketItemByIdUsingSigner(itemId) {
		setGettingItem(true);
		let nft = await getMarketItemByItemId(wallet, itemId);
		setGettingItem(false);
		return nft;
	}

	return (
		<NFTMarketContext.Provider
			value={{
				fetchingMarketItems,
				currentUserNFTOnMarketplace,
				currentUserNFTsBoughtOnMarketplace,
				creatingMarketItem,
				creatingMarketSale,
				gettingItem,
				fetchingMyNFTs,
				fetchingItemsCreated,
				marketItems,
				fetchMarketItemsUsingSigner,
				fetchItemsCreatedUsingSigner,
				fetchMyNFTsUsingSigner,
				createMarketItemUsingSigner,
				createSaleUsingSigner,
				getMarketItemByIdUsingSigner,
			}}
		>
			{children}
		</NFTMarketContext.Provider>
	);
}
