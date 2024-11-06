import React, { ReactNode } from "react";
import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  body {
    min-width: 100vw;
    min-height: 100vh;
    background-color: #263728;
  }
`;

type LayoutProps = {
	children?: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
	return (
		<>
			<GlobalStyle />
			{children}
		</>
	);
};

export default Layout;
