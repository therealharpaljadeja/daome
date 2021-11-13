import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "./theme";
import "@fontsource/inter";

import { Web3ContextProvider } from "./context/Web3Context";

ReactDOM.render(
	<React.StrictMode>
		<ChakraProvider theme={theme}>
			<Web3ContextProvider>
				<App />
			</Web3ContextProvider>
		</ChakraProvider>
	</React.StrictMode>,
	document.getElementById("root")
);
