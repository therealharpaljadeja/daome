import {
	Grid,
	HStack,
	VStack,
	Heading,
	Spinner,
	Tabs,
	TabList,
	TabPanels,
	TabPanel,
	Image,
	useColorModeValue,
} from "@chakra-ui/react";
import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { BiUser } from "react-icons/bi";
import { MdOutlineSell } from "react-icons/md";
import { useEffect } from "react/cjs/react.development";
import CustomTab from "../components/CustomTab";
import ProfileBody from "../components/ProfileBody";
import ProfileHeader from "../components/ProfileHeader";
import { Web3Context } from "../context/Web3Context";

function ProfilePage() {
	const web3Context = useContext(Web3Context);
	const {
		creator,
		creatorAddress,
		loadingNFT,
		currentUserNFTs,
		currentUserNFTOnMarketplace,
		currentUserNFTsBoughtOnMarketplace,
	} = web3Context;
	const { username, name, bio, profilePicUrl, royaltyEarned } = creator;

	const [userOwnedNFT, setUserOwnedNFT] = useState(null);
	const bg = useColorModeValue("brand.100", "brand.700");

	useEffect(() => {
		const {
			getNFTsOwnerByUserUsingSigner,
			fetchItemsCreatedUsingSigner,
			fetchMyNFTsUsingSigner,
		} = web3Context;
		if (creatorAddress != null && creator != null) {
			getNFTsOwnerByUserUsingSigner();
			fetchItemsCreatedUsingSigner();
			fetchMyNFTsUsingSigner();
		}
	}, [creatorAddress]);

	useEffect(() => {
		if (
			currentUserNFTs !== null &&
			currentUserNFTsBoughtOnMarketplace !== null
		) {
			setUserOwnedNFT([
				...currentUserNFTs,
				...currentUserNFTsBoughtOnMarketplace,
			]);
		}
	}, [currentUserNFTs, currentUserNFTsBoughtOnMarketplace]);

	return (
		<VStack width="100%" padding={0}>
			{creator !== null ? (
				<>
					<ProfileHeader
						username={username}
						profilePicUrl={profilePicUrl}
					/>
					{currentUserNFTs !== null &&
					userOwnedNFT !== null &&
					currentUserNFTOnMarketplace !== null &&
					currentUserNFTsBoughtOnMarketplace !== null ? (
						<ProfileBody
							nftOwned={
								userOwnedNFT.length +
								currentUserNFTOnMarketplace.length
							}
							username={username}
							bio={bio}
							name={name}
							royaltyEarned={royaltyEarned}
						/>
					) : (
						<Spinner />
					)}
					<HStack justifyContent="center" width="100%">
						{loadingNFT === false &&
						currentUserNFTs !== null &&
						currentUserNFTOnMarketplace !== null &&
						userOwnedNFT !== null ? (
							<Tabs isFitted width="100%">
								<TabList
									margin={4}
									boxSizing="border-box"
									padding={2}
									borderRadius={4}
									colorScheme="brand"
									background={bg}
									overflowX="scroll"
									width="100% - calc(2rem)"
									border={0}
								>
									<CustomTab
										icon={<MdOutlineSell />}
										number={userOwnedNFT.length}
										tabTitle="Owned"
									/>
									<CustomTab
										icon={<BiUser />}
										number={
											currentUserNFTOnMarketplace.length
										}
										tabTitle="Listed"
									/>
								</TabList>
								<TabPanels>
									<TabPanel padding={0}>
										{currentUserNFTs !== null ||
										currentUserNFTsBoughtOnMarketplace !==
											null ? (
											<Grid
												overflowY="scroll"
												gridGap="1px"
												templateColumns="repeat(3, 1fr)"
											>
												{userOwnedNFT !== null ? (
													userOwnedNFT.map(
														(nft, index) => {
															let toUrl = `/nft/${nft.creatorAddress}/${nft.collectionAddress}/${nft.tokenId}`;
															return (
																<Link
																	to={toUrl}
																>
																	<Image
																		key={
																			index
																		}
																		src={
																			nft.image
																		}
																	/>
																</Link>
															);
														}
													)
												) : (
													<Heading
														pt={3}
														textAlign="center"
														size="sm"
													>
														No NFTs
													</Heading>
												)}
											</Grid>
										) : (
											<Spinner />
										)}
									</TabPanel>
									<TabPanel padding={0}>
										<Grid
											overflowY="scroll"
											gridGap="1px"
											templateColumns="repeat(3, 1fr)"
										>
											{currentUserNFTOnMarketplace !==
											null ? (
												currentUserNFTOnMarketplace.map(
													(nft) => {
														let toUrl = `/nft/${nft.creatorAddress}/${nft.collectionAddress}/${nft.tokenId}`;
														return (
															<Link to={toUrl}>
																<Image
																	key={
																		nft.name
																	}
																	src={
																		nft.image
																	}
																/>
															</Link>
														);
													}
												)
											) : (
												<Spinner />
											)}
										</Grid>
									</TabPanel>
								</TabPanels>
							</Tabs>
						) : (
							<Spinner />
						)}
					</HStack>
				</>
			) : (
				<Spinner />
			)}
		</VStack>
	);
}
export default ProfilePage;
