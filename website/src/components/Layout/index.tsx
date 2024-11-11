import React, { ReactNode } from "react";
import { createGlobalStyle, keyframes, ThemeProvider } from "styled-components";
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

		background-image: linear-gradient(
			150deg,
			${currentTheme.backgroundCompliment} 0%,
			${currentTheme.background} 100%
		);
  }

	button {
		background-color: unset;
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

		@media (prefers-reduced-motion: no-preference) {
			&:not(:hover) {
				transition: color 500ms ease, border-color 500ms ease;
			}

			&:hover {
				/* transition: color 125ms ease, border-color 125ms ease; */
			}
		}
	}

	text {
		user-select: none;
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
