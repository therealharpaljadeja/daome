import React, { useState, useContext } from "react";
import {
	createMarketItem,
	createSale,
	fetchItemsCreated,
	fetchMarketItems,
	fetchMyNFTs,
	fetchListedItems,
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

	async function fetchListedItemsUsingSigner() {
		setFetchingItemsCreated(true);
		let result = await fetchListedItems(wallet);
		setFetchingItemsCreated(false);
		setCurrentUserNFTOnMarketplace(result);
	}

	async function fetchMyNFTsUsingSigner() {
		setFetchingMyNFTs(true);
		let result = await fetchMyNFTs(wallet);
		console.log(result);
		setCurrentUserNFTsBoughtOnMarketplace(result);
		setFetchingMyNFTs(false);
	}

	async function createMarketItemUsingSigner(
		collectionAddress,
		tokenId,
		price,
		modalCloser
	) {
		try {
			let tx = await createMarketItem(
				wallet,
				collectionAddress,
				tokenId,
				price
			);
			return tx;
		} catch (e) {
			console.log(e);
		} finally {
			modalCloser();
		}
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
				creatingMarketSale,
				gettingItem,
				fetchingMyNFTs,
				fetchingItemsCreated,
				marketItems,
				fetchMarketItemsUsingSigner,
				fetchListedItemsUsingSigner,
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
