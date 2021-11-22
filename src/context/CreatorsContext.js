import React, { useContext, useState, useEffect } from "react";
import {
	isUserRegistered,
	getCreatorAddressBySender,
	getCreatorAddressByUsername,
	registerUser,
	getCreatorObjFromAddress,
} from "../utils/Creators";
import { Web3Context } from "./Web3Context";

const validNetworkOptions = {
	chainId: "0xaef3",
	chainName: "Alfajores Testnet",
	nativeCurrency: { name: "Celo", symbol: "CELO", decimals: 18 },
	rpcUrls: ["https://alfajores-forno.celo-testnet.org"],
	blockExplorerUrls: ["https://alfajores-blockscout.celo-testnet.orgs"],
};

export const CreatorsContext = React.createContext(null);

export function CreatorsContextProvider({ children }) {
	const web3Context = useContext(Web3Context);
	const { account, wallet, provider, chainId } = web3Context;
	console.log(account, wallet, provider, chainId);
	const [checkingUserRegistered, setCheckingUserRegistered] = useState(false);
	const [creatorAddress, setCreatorAddress] = useState(null);
	const [creator, setCreator] = useState({});
	const [userRegistered, setUserRegistered] = useState(null);

	useEffect(() => {
		console.log(chainId);
		if (
			account !== null &&
			wallet !== null &&
			chainId === validNetworkOptions.chainId
		) {
			setCheckingUserRegistered(true);
			const init = async () => {
				async function checkUserRegistered() {
					let result = await isUserRegistered(wallet);
					return result;
				}

				checkUserRegistered().then((result) => {
					setUserRegistered(result);
					setCheckingUserRegistered(false);
				});
			};
			init();
		}
	}, [account, wallet, chainId]);

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
	}, [userRegistered]);

	useEffect(() => {
		if (creatorAddress !== null && wallet !== null && provider != null) {
			async function getCreatorObjUsingSigner() {
				getCreatorObjFromAddress(wallet, creatorAddress, provider).then(
					(result) => {
						console.log(result);
						setCreator(result);
					}
				);
			}
			getCreatorObjUsingSigner();
		}
	}, [creatorAddress]);

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

	async function checkUserRegistered() {
		let result = await isUserRegistered(wallet);
		return result;
	}

	return (
		<CreatorsContext.Provider
			value={{
				checkingUserRegistered,
				creatorAddress,
				creator,
				userRegistered,
				getCreatorAddressFromUsername,
				registerCreator,
			}}
		>
			{children}
		</CreatorsContext.Provider>
	);
}
