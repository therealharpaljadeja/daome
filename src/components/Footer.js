import { useContext } from "react";
import { Web3Context } from "../context/Web3Context";
import { Link } from "react-router-dom";
import {
	HStack,
	useDisclosure,
	Icon,
	useColorModeValue,
} from "@chakra-ui/react";
import { FiHome } from "react-icons/fi";
import MintNFTModal from "./MintNFTModal";
import { IoMdAdd } from "react-icons/io";
import { AiOutlineUser } from "react-icons/ai";

function Footer() {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const web3Context = useContext(Web3Context);
	const { creator, account } = web3Context;
	const bg = useColorModeValue("white", "var(--chakra-colors-gray-800)");

	return (
		<>
			<MintNFTModal isOpen={isOpen} onClose={onClose} />
			<HStack
				width="100%"
				bottom={0}
				position="sticky"
				borderTop="1px solid"
				borderColor="brand.200"
				justifyContent="space-between"
				alignSelf="flex-end"
				padding={5}
				height="8vh"
				background={bg}
				boxShadow="0 -10px 200px 6px rgba(0,0,0,.1)"
			>
				<Link to="/feed">
					<Icon as={FiHome} w={5} h={5} />
				</Link>
				{account !== null &&
				account !== undefined &&
				creator !== null ? (
					<Icon onClick={onOpen} as={IoMdAdd} w={7} h={7} />
				) : null}
				<Link to="/">
					<Icon as={AiOutlineUser} w={5} h={5} />
				</Link>
			</HStack>
		</>
	);
}

export default Footer;
