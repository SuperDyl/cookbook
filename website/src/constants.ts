import { DefaultTheme } from "styled-components";

export const darkGreen = "#263728";
export const nearDarkGreen = "#2b6422";
export const nearWhite = "#d8f9dc";
export const brightGreen = "#40c81e";
export const green = "#358629";

export const nearBlack = "#1a1d1a";

export const contentWidth = "800px";

export const DarkTheme: DefaultTheme = {
	background: darkGreen,
	backgroundCompliment: nearDarkGreen,
	text: nearWhite,
	action: brightGreen,
	hover: brightGreen,
	active: green,
	focus: brightGreen,

	contentWidth: contentWidth,
};

export const LightTheme: DefaultTheme = {
	background: nearWhite,
	backgroundCompliment: nearWhite,
	text: nearBlack,
	action: darkGreen,
	hover: green,
	active: nearBlack,
	focus: darkGreen,

	contentWidth: contentWidth,
};
