import React, { useEffect, useState } from "react";
import { isUserRegistered, getCreatorAddressBySender, getCreatorAddressByUsername, registerUser, getCreatorObjFromAddress } from "../utils/Creators";
import { approveToMarketplace, mintNFT, tokenMetadata, tokenOwnedByUser, withdrawRoyalty } from "../utils/NFT";
import { createMarketItem, createSale, fetchItemsCreated, fetchMarketItems, fetchMyNFTs, getMarketItemByItemId } from "../utils/NFTMarket";
import { Provider, Signer as EvmSigner } from '@reef-defi/evm-provider';
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';
import { WsProvider } from '@polkadot/rpc-provider';

export const Web3Context = React.createContext(undefined);



export function Web3ContextProvider({ children }) {

	const URL = 'wss://rpc-testnet.reefscan.com/ws';
	const [isApiConnected, setIsApiConnected] = useState(false);
	const [isApiInitialized, setIsApiInitialized] = useState(false);

	const [injectedAccounts, setInjectedAccounts] = useState([]);
	const [accountSigner, setAccountSigner] = useState(null);
	const [extensions, setExtensions] = useState(null);

	const [accountId, setAccountId] = useState(null);
	const [evmAddress, setEvmAddress] = useState(null);
	const [evmProvider, setEvmProvider] = useState(null);

    const [ wallet, setWallet ] = useState(null);


    const [ provider, setProvider ] = useState(null);
    const [ isProviderLoading, setIsProviderLoading ] = useState(true);
    const [ chainId, setChainId ] = useState(null);
    const [ account, setAccount ] = useState(null);
    const [ userRegistered, setUserRegistered ] = useState(null);
    const [ creator, setCreator ] = useState({});
    const [ creatorAddress, setCreatorAddress ] = useState(null);
    const [ checkingUserRegistered, setCheckingUserRegistered ] = useState(false);
    const [ isMintingNFT, setIsMintingNFT ] = useState(false);
    const [ loadingNFT, setLoadingNFT ] = useState(false);
    const [ fetchingMarketItems, setFetchingMarketItems ] = useState(false);
    const [ fetchingItemsCreated, setFetchingItemsCreated ] = useState(false);
    const [ fetchingMyNFTs, setFetchingMyNFTs ] = useState(false);
    const [ creatingMarketSale, setCreatingMarketSale ] = useState(false);
    const [ currentUserNFTs, setCurrentUserNFTs ] = useState(null);
    const [ currentUserNFTOnMarketplace, setCurrentUserNFTOnMarketplace ] = useState(null);
    const [ marketItems, setMarketItems ] = useState(null);
    const [ gettingMetadata, setGettingMetadata ] = useState(null);
    const [ approvingToMarketplace, setApprovingToMarketplace ] = useState(false);
    const [ creatingMarketItem, setCreatingMarketItem ] = useState(false);
    const [ currentUserNFTsBoughtOnMarketplace, setCurrentUserNFTsBoughtOnMarketplace ] = useState(null);
    const [ gettingItem, setGettingItem ] = useState(false);
    const [ withdrawingRoyalty, setWithdrawingRoyalty ] = useState(false);

    useEffect(() => {
		// Polkadot.js extension initialization as per https://polkadot.js.org/docs/extension/usage/
		const injectedPromise = web3Enable('nftbay');
		const evmProvider = new Provider({
		  provider: new WsProvider(URL)
		});

		setEvmProvider(evmProvider);
	
		evmProvider.api.on('connected', () => setIsApiConnected(true));
		evmProvider.api.on('disconnected', () => setIsApiConnected(false));

        // Populate account dropdown with all accounts when API is ready
		evmProvider.api.on('ready', async () => {
		  try {
            await injectedPromise
			  .then(() => web3Accounts())
			  .then((accounts) =>
				accounts.map(
					({ address, meta }) => ({
						address,
						meta: {
						...meta,
						name: `${meta.name || 'unknown'} (${meta.source === 'polkadot-js' ? 'extension' : meta.source})`,
						}
					})
				)				
			  )
			  .then((accounts) => {
				setInjectedAccounts(accounts);
				setAccountId(accounts[0].address);
			  })
			  .catch((error) => {
				console.error('web3Enable', error);
	
				return [];
			  });
		  } catch (error) {
			console.error('Unable to load chain', error);
		  }
		});
	
		// Setup Polkadot.js signer
		injectedPromise
		  .then(async (extensions) => {
			setExtensions(extensions);
			setAccountSigner(extensions[0]?.signer);
		  })
		  .catch((error) => console.error(error));
	
		setIsApiInitialized(true);
	}, []);


    useEffect(() => {
		if (wallet) {
		  evmProvider.api.isReady.then(() => {
			evmProvider.api.query.evmAccounts.evmAddresses(accountId).then(async (result) => {
			  if (result.isEmpty) {
                await wallet.claimDefaultAccount();
				setEvmAddress((await wallet.getAddress()));
			  } else {
				setEvmAddress(result.toString());
			  }
			});
		  });
		} else {
		  setEvmAddress(null);
		}
	}, [wallet]);


    useEffect(() => {
        if (accountId && evmProvider && accountSigner) {
            setWallet(new EvmSigner(evmProvider, accountId, accountSigner));
        }
    }, [accountId]);
    
    useEffect(() => {
        if(evmAddress != null && wallet != null) {
            setCheckingUserRegistered(true);
            const init = async () => {
                checkUserRegistered()
                .then(result => {
                    setUserRegistered(result);
                    setCheckingUserRegistered(false);
                })
            }
            init();
        }
    }, [evmAddress, wallet]);

    useEffect(() => {
        if(userRegistered != false && wallet != null) {
            getCreatorAddressBySenderUsingSigner();
        }
    }, [userRegistered]);

    useEffect(() => {
        if(creatorAddress != null) {
            getCreatorObjUsingSigner();
        }
    },[creatorAddress])

    async function getCreatorAddressBySenderUsingSigner() {
        getCreatorAddressBySender(wallet)
        .then(result => {
            setCreatorAddress(result);
        })
    }

    async function getCreatorObjUsingSigner() {
        getCreatorObjFromAddress(wallet, creatorAddress)
        .then(result => {
            setCreator(result);
        });
    }

    async function checkUserRegistered() {
        let result = await isUserRegistered(wallet, evmAddress);
        return result;
    }

    async function getCreatorAddressFromUsername(username) {
        let result = await getCreatorAddressByUsername(wallet, username);
        return result;
    }

    async function registerCreator(creator) {
        const result = await registerUser(wallet, creator);
        if(result.hash != undefined) {
            setUserRegistered(true);
        }
    }

    async function mintNFTUsingSigner(tokenURI, royaltyPercentage) {
        setIsMintingNFT(true);
        let result = await mintNFT(wallet, creatorAddress, tokenURI, royaltyPercentage);
        setIsMintingNFT(false);
    }

    async function getNFTsOwnerByUserUsingSigner() {
        setLoadingNFT(true);
        let result = await tokenOwnedByUser(wallet, creatorAddress);
        setCurrentUserNFTs(result);
        setLoadingNFT(false);
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

    async function createMarketItemUsingSigner(collectionAddress, tokenId, price) {
        setCreatingMarketItem(true);
        await createMarketItem(wallet, collectionAddress, tokenId, price);
        setCreatingMarketItem(false);
    }

    async function createSaleUsingSigner(collectionAddress, tokenId, price) {
        setCreatingMarketSale(true);
        await createSale(wallet, collectionAddress, tokenId, price);
        setCreatingMarketSale(false);
    }

    async function nftMetadataUsingSigner(creatorAddress, collectionAddress, tokenId) {
        setGettingMetadata(true);
        let nft = await tokenMetadata(wallet, creatorAddress, collectionAddress, tokenId);
        setGettingMetadata(false);
        return nft;
    }

    async function approveToMarketplaceUsingSigner(collectionAddress, tokenId) {
        setApprovingToMarketplace(true);
        await approveToMarketplace(wallet, collectionAddress, tokenId);
        setApprovingToMarketplace(false);
    }

    async function getMarketItemByIdUsingSigner(itemId) {
        setGettingItem(true);
        let nft = await getMarketItemByItemId(wallet, itemId);
        setGettingItem(false);
        return nft;
    }

    async function withdrawRoyaltyUsingSigner() {
        setWithdrawingRoyalty(true);
        withdrawRoyalty(creator.nftCollectionAddress, wallet);
        setWithdrawingRoyalty(false);
    }

    return (
        <Web3Context.Provider 
            value={{ 
                isProviderLoading, 
                provider,
                chainId,
                account,
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
                accountId,
                evmAddress,
                wallet,
                injectedAccounts,
                withdrawingRoyalty,
                setAccountId,
                fetchMarketItemsUsingSigner,
                fetchItemsCreatedUsingSigner,
                fetchMyNFTsUsingSigner,
                createSaleUsingSigner,
                getNFTsOwnerByUserUsingSigner,
                mintNFTUsingSigner,
                getCreatorAddressFromUsername,
                registerCreator,
                checkUserRegistered,
                nftMetadataUsingSigner,
                approveToMarketplaceUsingSigner,
                createMarketItemUsingSigner,
                getMarketItemByIdUsingSigner,
                withdrawRoyaltyUsingSigner
            }}
        >
            {children}
        </Web3Context.Provider>
    )
}