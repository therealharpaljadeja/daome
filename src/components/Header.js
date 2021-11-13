import { useContext } from "react";
import {
	HStack,
	Text,
	useDisclosure,
	IconButton,
	useColorMode,
	Spacer,
} from "@chakra-ui/react";
import { FiSettings, FiSun } from "react-icons/fi";
import { Web3Context } from "../context/Web3Context";
import ProfileSettingsModal from "./ProfileSettingsModal";

function Header() {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const { toggleColorMode } = useColorMode();
	const web3Context = useContext(Web3Context);
	const { creator } = web3Context;

	return (
		<>
			<ProfileSettingsModal isOpen={isOpen} onClose={onClose} />
			<HStack
				top={0}
				justifyContent="space-between"
				padding={4}
				borderBottom="1px solid"
				borderColor="brand.200"
				position="sticky"
				zIndex="1000"
				background="light.200"
				width="100%"
				height="8vh"
				boxShadow="0 10px 200px 6px rgba(0,0,0,.1)"
			>
				<Text>DAOMe</Text>
				<Spacer />
				<IconButton
					onClick={toggleColorMode}
					variant="ghost"
					colorScheme="whiteAlpha"
					icon={<FiSun stroke="var(--chakra-colors-purple-800)" />}
				/>
				<IconButton
					onClick={onOpen}
					variant="ghost"
					colorScheme="whiteAlpha"
					disabled={Object.keys(creator).length === 0}
					icon={
						<FiSettings stroke="var(--chakra-colors-purple-800)" />
					}
				/>
			</HStack>
		</>
	);
}

export default Header;
