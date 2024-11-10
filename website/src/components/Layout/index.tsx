import React, { ReactNode } from "react";
import { createGlobalStyle, ThemeProvider } from "styled-components";
import { DarkTheme } from "../../constants";

let currentTheme = DarkTheme;

const GlobalStyle = createGlobalStyle`
	* {
		color: ${currentTheme.text};
	}

	text {
		fill: ${currentTheme.text};
	}

  body {
    min-width: 100vw;
    min-height: 100vh;
    background-color: ${currentTheme.background};
		margin: 0;
		overflow: hidden;
		position: relative;
  }

	button {
		background-color: ${currentTheme.background};
		border-color: ${currentTheme.text};
		border-style: solid;
		border-radius: .67em;
		font-size: 1em;
		user-select: none;
		margin: .2em .4em;

		&:hover {
			cursor: pointer;
			border-color: ${currentTheme.hover};
			color: ${currentTheme.hover};
		}

		&:active {
			border-color: ${currentTheme.active};
			color: ${currentTheme.active};
		}

		&:focus {
			/* border-color: ${currentTheme.focus};
			color: ${currentTheme.focus}; */
		}
	}
`;

type LayoutProps = {
	children?: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
	return (
		<>
			<GlobalStyle />
			<ThemeProvider theme={currentTheme}>{children}</ThemeProvider>
		</>
	);
};

export default Layout;
