import { HStack, Text, Tag, Link } from "@chakra-ui/react";
import CustomAvatar from "./CustomAvatar";
import { FiExternalLink } from "react-icons/fi";

function PostHeader({ owner, name, profilePicUrl }) {
	return (
		<>
			<HStack
				borderBottom="1px solid"
				borderColor="brand.200"
				px={4}
				py={4}
				width="100%"
				justifyContent="flex-start"
			>
				<CustomAvatar src={profilePicUrl} size="sm" name={name} />
				<Text>{name}</Text>
				<Link
					href={`${process.env.REACT_APP_EXPLORER_URL}/address/${owner}/transactions`}
					textDecoration="none"
					target="_blank"
				>
					<Tag>
						<span style={{ marginRight: "5px" }}>
							{owner.substr(0, 7)}
						</span>{" "}
						<FiExternalLink />
					</Tag>
				</Link>
			</HStack>
		</>
	);
}

export default PostHeader;
