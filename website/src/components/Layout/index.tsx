"use client"

import React, { ReactNode } from "react";
import { createGlobalStyle, ThemeProvider } from "styled-components";
import { DarkTheme } from "../../constants";
import { Background } from "./styles";

const currentTheme = DarkTheme;

const GlobalStyle = createGlobalStyle`
	/* From https://www.joshwcomeau.com/css/custom-css-reset/ */
	/* 1. Use a more-intuitive box-sizing model */
	*, *::before, *::after {
		box-sizing: border-box;
	}

	/* 2. Remove default margin */
	* {
		margin: 0;
	}

	body {
		/* 3. Add accessible line-height */
		line-height: calc(1em + 0.5rem);
		/* 4. Improve text rendering */
		-webkit-font-smoothing: antialiased;
	}

	/* 5. Improve media defaults */
	img, picture, video, canvas, svg {
		display: block;
		max-width: 100%;
	}

	/* 6. Inherit fonts for form controls */
	input, button, textarea, select {
		font: inherit;
	}

	/* 7. Avoid text overflows */
	p, h1, h2, h3, h4, h5, h6 {
		overflow-wrap: break-word;
	}

	/* 8. Improve line wrapping */
	p {
		text-wrap: pretty;
	}
	h1, h2, h3, h4, h5, h6 {
		text-wrap: balance;
	}

	/*
		9. Create a root stacking context
	*/
	#root, #__next {
		isolation: isolate;
	}	
	
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
		font-weight: 500;
	}

	input {
		background-color: unset;
		border-color: ${currentTheme.text};
		border-style: solid;
		border-radius: .67em;
		font-size: 1em;
		margin: .2em .4em;
		padding: 0.5em;
	}

	input[type="text"] {
		font-family: monospace;
	}

	input[type="text"]::placeholder {
		color: ${currentTheme.textCompliment};
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
