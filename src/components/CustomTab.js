import { Tab, Text, HStack } from "@chakra-ui/react";

function CustomTab({ icon, number }) {
    return (
        <Tab borderColor="brand.100">
            <HStack>
                {icon}
                <Text>{number}</Text>
            </HStack>
        </Tab>
    )
}

export default CustomTab;