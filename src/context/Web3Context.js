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

import { CeloProvider } from "@celo-tools/celo-ethers-wrapper";
import { BsCheck2 } from "react-icons/bs";

export const Web3Context = React.createContext(null);

const validNetworkOptions = {
	chainId: "0xaef3",
	chainName: "Alfajores Testnet",
	nativeCurrency: { name: "Celo", symbol: "CELO", decimals: 18 },
	rpcUrls: ["https://alfajores-forno.celo-testnet.org"],
	blockExplorerUrls: ["https://alfajores-blockscout.celo-testnet.orgs"],
};

export function Web3ContextProvider({ children }) {
	const { isOpen, onOpen, onClose } = useDisclosure();

	const [metamaskInstalled, setMetamaskInstalled] = useState(false);
	const [wallet, setWallet] = useState(null);
	const [account, setAccount] = useState(null);
	const [connectingAccount, setConnectingAccount] = useState(false);
	const [provider, setProvider] = useState(null);
	const [chainId, setChainId] = useState(null);
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
				window.location.reload();
				// setWallet(new providers.Web3Provider(window.ethereum));
				// setAccount(accounts[0]);
			});
		} else {
			setMetamaskInstalled(false);
		}
	}, []);

	useEffect(() => {
		console.log("set chain id");
		if (wallet !== null) {
			setChainId(wallet.provider.chainId);
		}
	}, [account]);

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

	return (
		<Web3Context.Provider
			value={{
				metamaskInstalled,
				provider,
				chainId,
				connectingAccount,
				account,
				wallet,
				connectWallet,
				requestNetworkChange,
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
