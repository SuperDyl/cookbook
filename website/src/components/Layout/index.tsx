import React, { ReactNode } from "react";
import { createGlobalStyle, keyframes, ThemeProvider } from "styled-components";
import { DarkTheme } from "../../constants";
import { Background } from "./styles";

let currentTheme = DarkTheme;

const GlobalStyle = createGlobalStyle`
	@font-face {
		font-family: 'Lora';
		font-style: normal;
		font-weight: 400;
		font-display: swap;
		src: url(/fonts/lora/lora-variable.ttf) format('truetype');
	}

	* {
		color: ${currentTheme.text};
		font-family: Lora, 'Times New Roman', Times, serif;
	}

	text {
		fill: ${currentTheme.text};
	}

  body {
    background-color: ${currentTheme.background};
		margin: 0;
  }

	button {
		background-color: unset;
		border-color: ${currentTheme.text};
		border-style: solid;
		border-radius: .67em;
		font-size: 1em;
		user-select: none;
		margin: .2em .4em;
		padding: 0.5em;

		&:hover {
			cursor: pointer;
			border-color: ${currentTheme.hover};
			color: ${currentTheme.hover};
		}

		&:active {
			border-color: ${currentTheme.active};
			color: ${currentTheme.active};
		}

		&:disabled {
			border-color: ${currentTheme.disabled};
			color: ${currentTheme.disabled};
			pointer-events: none;
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

const Layout = ({ children }: LayoutProps) => (
	<>
		<GlobalStyle />

		<ThemeProvider theme={currentTheme}>
			<Background>{children}</Background>
		</ThemeProvider>
	</>
);

export default Layout;
