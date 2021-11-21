import React, { useContext } from "react";
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

export function CreatorContextProvider({ children }) {
	const web3Context = useContext(Web3Context);
	const { account, wallet, provider } = web3Context;

	const [checkingUserRegistered, setCheckingUserRegistered] = useState(false);
	const [creatorAddress, setCreatorAddress] = useState(null);
	const [creator, setCreator] = useState({});
	const [userRegistered, setUserRegistered] = useState(null);

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
