import {
	HStack,
	Box,
	VStack,
	FormControl,
	FormLabel,
	Input,
	Text,
	Spacer,
} from "@chakra-ui/react";
import { BsFillCameraFill } from "react-icons/bs";

function App() {
	return (
		<HStack padding={4}>
			<FormControl>
				<FormLabel cursor="pointer">
					<Box
						padding={1}
						borderRadius=".5rem"
						background="var(--chakra-colors-brand-100)"
						width="150px"
						height="150px"
					>
						<VStack
							border="2px dashed var(--chakra-colors-brand-500)"
							padding={2}
							justifyContent="space-around"
							height="100%"
							borderRadius=".5rem"
						>
							<BsFillCameraFill
								size="30px"
								fill="var(--chakra-colors-brand-500)"
							/>
							<Text>Upload Image</Text>
						</VStack>
					</Box>
				</FormLabel>
				<Input display="none" type="file" accept="image/*" />
			</FormControl>
		</HStack>
	);
}

export default App;
