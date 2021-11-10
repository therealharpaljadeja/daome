import { useContext } from "react";
import { Web3Context } from "../context/Web3Context";
import { Link } from "react-router-dom";
import { HStack, IconButton, useDisclosure } from "@chakra-ui/react";
import { GrHomeRounded } from "react-icons/gr";
import MintNFTModal from "./MintNFTModal";
import { IoMdAdd } from "react-icons/io";
import { AiOutlineUser } from "react-icons/ai";

function Footer() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const web3Context = useContext(Web3Context);
    const { accountId } = web3Context;

    return (
        <>
            <MintNFTModal isOpen={isOpen} onClose={onClose} />
            <HStack background="white" width="100%" bottom={0} position="sticky" borderTop="1px solid" borderColor="brand.200" justifyContent="space-between" alignSelf="flex-end" padding={5} width="100%" height="8vh" boxShadow="0 -10px 200px 6px rgba(0,0,0,.1)">
                <Link to="/feed">
                    <IconButton icon={<GrHomeRounded fill="white" />} size="sm" />
                </Link>

                {/* <FiUsers disabled={(account == null || account == undefined).toString()} size="22px" /> */}
                <IconButton disabled={accountId === null || accountId === undefined} onClick={onOpen} icon={<IoMdAdd strokeWidth="60px" />} />
                {/* <IoMdAdd size="25px" /> */}
                {/* <BsChatLeft disabled={(account == null || account == undefined).toString()} size="22px" /> */}
                <Link to="/">
                    <IconButton icon={<AiOutlineUser />} size="sm" />
                </Link>
            </HStack>
        </>
    )   
}

export default Footer;