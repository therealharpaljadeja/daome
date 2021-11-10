import { HStack, Text, useDisclosure, IconButton, Select, Image } from "@chakra-ui/react";
import { FiSettings } from "react-icons/fi";
import ProfileSettingsModal from "./ProfileSettingsModal";
import { Web3Context } from "../context/Web3Context";
import { useContext } from "react";
import { Identicon } from '@polkadot/react-identicon';
import { useEffect, useState } from "react";

function Header() {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const web3Context = useContext(Web3Context);
    const { injectedAccounts, accountId, setAccountId } = web3Context;

    const [ currentAccountId, setCurrentAccountId ] = useState(null);
    const [ injectedAccountsFromContext, setInjectedAccountsFromContext ] = useState(null);
 
    useEffect(() => {
        if(injectedAccounts !== undefined) {
            setInjectedAccountsFromContext(injectedAccounts);  
        }
    }, [JSON.stringify(injectedAccounts)])

    useEffect(() => {
        if(accountId !== null) {
            setCurrentAccountId(accountId);
        }
    }, [accountId])

    return (
        <>
            <ProfileSettingsModal isOpen={isOpen} onClose={onClose}  />
            <HStack top={0} justifyContent="space-between" padding={4} borderBottom="1px solid" borderColor="brand.200" position="sticky" zIndex="1000" background="light.200" width="100%" height="8vh" boxShadow="0 10px 200px 6px rgba(0,0,0,.1)">
                <Text color="brand.100">NFTBay</Text>
                {
                    injectedAccountsFromContext !== null && accountId != null && currentAccountId != null ?
                    <>
                        <Select value={accountId} onChange={({ target }) => { console.log(target.value); setAccountId(target.value); } } width="200px">
                            {
                                injectedAccountsFromContext.map((account, index) => {
                                    return (
                                        <option key={index} value={account.address}>
                                            {`${account.address.substr(0,5)}...${account.address.substr(-5, 6)}`}
                                        </option>
                                    );
                                })
                            }
                        </Select>
                        <Identicon size="32px" className='icon' theme='polkadot' value={currentAccountId} />
                    </>
                    :
                    null
                }

                <IconButton onClick={onOpen} variant="ghost" colorScheme="whiteAlpha" icon={<FiSettings stroke="#aa00ff" />} />
            </HStack>
        </>
    );
}

export default Header;