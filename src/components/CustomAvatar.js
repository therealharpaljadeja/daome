import { Avatar } from "@chakra-ui/react";

function CustomAvatar(props) {
    return (
        <Avatar size="lg" {...props} borderRadius="full" borderColor="brand.100" color="brand.100" border="2px solid" padding="2px" background="transparent" name={props.name} src={props.src}   />
    )
}

export default CustomAvatar;