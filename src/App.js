import { useContext } from "react";

// React Components
import Header from "./components/Header";
import CustomModal from "./components/CustomModal";
import Footer from "./components/Footer";
import Feed from "./pages/Feed";
import ProfilePage from "./pages/ProfilePage";
import OnboardingModal from "./components/OnboardingModal";
import PostPage from "./pages/PostPage";

// React Context
import { Web3Context } from "./context/Web3Context";

// React Router
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

// Chakra UI
import { VStack, Grid, Button, useDisclosure, HStack } from "@chakra-ui/react";
import { CreatorsContext } from "./context/CreatorsContext";

function App() {
	const { onClose } = useDisclosure();

	const web3Context = useContext(Web3Context);
	const {
		chainId,
		requestNetworkChange,
		account,
		connectWallet,
		connectingAccount,
	} = web3Context;

	const creatorsContext = useContext(CreatorsContext);
	const { userRegistered } = creatorsContext;
	return (
		<Router>
			<CustomModal
				modalButtonOnClick={requestNetworkChange}
				isOpen={
					chainId !== "0xaef3" &&
					chainId !== null &&
					chainId !== undefined
				}
				onClose={onClose}
				modalHeader="Invalid Network"
				modalCloseButton={false}
				modalFooterButtonText="Change Network"
			></CustomModal>
			<Grid
				height="100vh"
				width="100vw"
				templateColumns={["1fr", "1fr 2fr 1fr"]}
			>
				<VStack justifyContent="space-between" spacing={0}>
					<Header />
					<HStack
						width="100%"
						height="100%"
						alignItems="flex-start"
						justifyContent="center"
					>
						{account !== null ? (
							userRegistered !== null ? (
								userRegistered === true ? (
									<Switch>
										<Route exact path="/">
											<ProfilePage />
										</Route>
										<Route
											exact
											path="/nft/:creatoraddress/:address/:id"
										>
											<PostPage />
										</Route>
										<Route
											exact
											path="/nft/marketplace/:creator/:address/:itemid"
										>
											<PostPage />
										</Route>
										<Route exact path="/feed">
											<Feed />
										</Route>
									</Switch>
								) : (
									<OnboardingModal
										accountAddress={account}
										isOpen={userRegistered === false}
										onClose={onClose}
									/>
								)
							) : null
						) : (
							<Button
								alignSelf="center"
								isLoading={connectingAccount}
								onClick={connectWallet}
							>
								Connect Wallet
							</Button>
						)}
					</HStack>

					<Footer />
				</VStack>
			</Grid>
		</Router>
	);
}

export default App;
