import { HStack, Text } from "@chakra-ui/react";
import CustomAvatar from "./CustomAvatar";

function PostHeader({ name, profilePicUrl }) {
    return (
        <>
            <HStack borderBottom="1px solid" borderColor="brand.200" px={4} py={4} width="100%" justifyContent="flex-start">
                <CustomAvatar src={profilePicUrl}  size="sm" name={name} />
                <Text>{name}</Text>
            </HStack>
        </>
    );
}

export default PostHeader;