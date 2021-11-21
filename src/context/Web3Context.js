import { providers } from "ethers";
import React, { useEffect, useState } from "react";
import {
	VStack,
	Heading,
	Modal,
	ModalContent,
	Button,
	ModalOverlay,
	ModalCloseButton,
	ModalBody,
	ModalHeader,
	Box,
	Icon,
	Link,
	useDisclosure,
	useColorModeValue,
} from "@chakra-ui/react";
import {
	isUserRegistered,
	getCreatorAddressBySender,
	getCreatorAddressByUsername,
	registerUser,
	getCreatorObjFromAddress,
} from "../utils/Creators";
import {
	createMarketItem,
	createSale,
	fetchItemsCreated,
	fetchMarketItems,
	fetchMyNFTs,
	getMarketItemByItemId,
} from "../utils/NFTMarket";
import { CeloProvider } from "@celo-tools/celo-ethers-wrapper";
import { BsCheck2 } from "react-icons/bs";

export const Web3Context = React.createContext(null);

const validNetworkOptions = {
	chainId: "0xaef3",
	chainName: "Alfajores Testnet",
	nativeCurrency: { name: "Celo", symbol: "CELO", decimals: 18 },
	rpcUrls: ["https://alfajores-forno.celo-testnet.org"],
	blockExplorerUrls: ["https://alfajores-blockscout.celo-testnet.orgs"],
	// iconUrls: ['future']
};

export function Web3ContextProvider({ children }) {
	const { isOpen, onOpen, onClose } = useDisclosure();

	const [metamaskInstalled, setMetamaskInstalled] = useState(false);
	const [wallet, setWallet] = useState(null);
	const [account, setAccount] = useState(null);
	const [connectingAccount, setConnectingAccount] = useState(false);
	const [provider, setProvider] = useState(null);
	const [chainId, setChainId] = useState(null);
	const [userRegistered, setUserRegistered] = useState(null);
	const [creator, setCreator] = useState({});
	const [creatorAddress, setCreatorAddress] = useState(null);
	const [checkingUserRegistered, setCheckingUserRegistered] = useState(false);
	const [fetchingMarketItems, setFetchingMarketItems] = useState(false);
	const [fetchingItemsCreated, setFetchingItemsCreated] = useState(false);
	const [fetchingMyNFTs, setFetchingMyNFTs] = useState(false);
	const [creatingMarketSale, setCreatingMarketSale] = useState(false);
	const [currentUserNFTs, setCurrentUserNFTs] = useState(null);
	const [currentUserNFTOnMarketplace, setCurrentUserNFTOnMarketplace] =
		useState(null);
	const [marketItems, setMarketItems] = useState(null);
	const [creatingMarketItem, setCreatingMarketItem] = useState(false);
	const [
		currentUserNFTsBoughtOnMarketplace,
		setCurrentUserNFTsBoughtOnMarketplace,
	] = useState(null);
	const [gettingItem, setGettingItem] = useState(false);
	const [transactionLink, setTransactionLink] = useState(null);

	useEffect(() => {
		if (window.ethereum !== undefined) {
			setMetamaskInstalled(true);
			const provider = new CeloProvider(
				"https://alfajores-forno.celo-testnet.org"
			);
			setProvider(provider);
			setWallet(new providers.Web3Provider(window.ethereum));

			window.ethereum.on("chainChanged", (chainId) => {
				setChainId(chainId);
			});

			window.ethereum.on("accountsChanged", (accounts) => {
				setAccount(accounts[0]);
			});
		} else {
			setMetamaskInstalled(false);
		}
	}, []);

	useEffect(() => {
		if (account !== null && chainId === validNetworkOptions.chainId) {
			setCheckingUserRegistered(true);
			const init = async () => {
				async function checkUserRegistered() {
					let result = await isUserRegistered(wallet);
					return result;
				}

				checkUserRegistered().then((result) => {
					setUserRegistered(result);
					setCheckingUserRegistered(true);
				});
			};
			init();
		}
	}, [account]);

	useEffect(() => {
		if (wallet !== null) {
			setChainId(wallet.provider.chainId);
		}
	}, [wallet]);

	useEffect(() => {
		if (
			userRegistered !== null &&
			userRegistered !== false &&
			wallet !== null
		) {
			async function getCreatorAddressBySenderUsingSigner() {
				getCreatorAddressBySender(wallet).then((result) => {
					setCreatorAddress(result);
				});
			}

			getCreatorAddressBySenderUsingSigner();
		}
	}, [userRegistered, wallet]);

	useEffect(() => {
		if (creatorAddress !== null && wallet !== null && provider != null) {
			async function getCreatorObjUsingSigner() {
				getCreatorObjFromAddress(wallet, creatorAddress, provider).then(
					(result) => {
						setCreator(result);
					}
				);
			}

			getCreatorObjUsingSigner();
		}
	}, [creatorAddress, wallet, provider]);

	async function connectWallet() {
		setConnectingAccount(true);
		window.ethereum
			.request({
				method: "eth_requestAccounts",
			})
			.then((accounts) => {
				setConnectingAccount(false);
				setAccount(accounts[0]);
			})
			.catch((error) => {
				console.log(error);
			});
	}

	async function requestNetworkChange() {
		console.log("requesting network change");
		window.ethereum.request({
			method: "wallet_addEthereumChain",
			params: [validNetworkOptions],
		});
	}

	async function getCreatorAddressFromUsername(username) {
		let result = await getCreatorAddressByUsername(wallet, username);
		return result;
	}

	async function registerCreator(creator) {
		const result = await registerUser(wallet, creator);
		if (result.hash !== undefined) {
			setUserRegistered(true);
		}
	}

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
		<Web3Context.Provider
			value={{
				metamaskInstalled,
				provider,
				chainId,
				connectingAccount,
				account,
				checkingUserRegistered,
				userRegistered,
				creator,
				creatorAddress,
				isMintingNFT,
				fetchingMarketItems,
				fetchingItemsCreated,
				fetchingMyNFTs,
				creatingMarketSale,
				loadingNFT,
				currentUserNFTs,
				currentUserNFTOnMarketplace,
				marketItems,
				gettingMetadata,
				approvingToMarketplace,
				creatingMarketItem,
				currentUserNFTsBoughtOnMarketplace,
				wallet,
				withdrawingRoyalty,
				gettingItem,
				connectWallet,
				requestNetworkChange,
				fetchMarketItemsUsingSigner,
				fetchItemsCreatedUsingSigner,
				fetchMyNFTsUsingSigner,
				createSaleUsingSigner,
				getNFTsOwnerByUserUsingSigner,
				mintNFTUsingSigner,
				getCreatorAddressFromUsername,
				registerCreator,
				nftMetadataUsingSigner,
				approveToMarketplaceUsingSigner,
				createMarketItemUsingSigner,
				getMarketItemByIdUsingSigner,
				withdrawRoyaltyUsingSigner,
			}}
		>
			<Modal isOpen={isOpen} isCentered onClose={onClose}>
				<ModalOverlay />
				<ModalContent margin="10px">
					<ModalCloseButton />
					<ModalHeader></ModalHeader>
					<ModalBody padding="20px">
						<VStack justifyContent="center" spacing="20px">
							<Box
								background={useColorModeValue(
									"var(--chakra-colors-brand-200)",
									"var(--chakra-colors-brand-700)"
								)}
								borderRadius="full"
								padding="15px"
							>
								<Icon w="25px" h="25px" as={BsCheck2} />
							</Box>
							<Heading size="md">Transaction Successful</Heading>
							<Link href={transactionLink}>
								<Button>View on Explorer</Button>
							</Link>
						</VStack>
					</ModalBody>
				</ModalContent>
			</Modal>
			{children}
		</Web3Context.Provider>
	);
}
