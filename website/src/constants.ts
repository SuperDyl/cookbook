import { DefaultTheme } from "styled-components";

export const darkGreen = "#263728";
export const nearWhite = "#d8f9dc";
export const brightGreen = "#35a619";
export const green = "#358629";

export const nearBlack = "#1a1d1a";

export const contentWidth = "800px";

export const DarkTheme: DefaultTheme = {
	background: darkGreen,
	text: nearWhite,
	action: brightGreen,
	hover: green,
	active: brightGreen,
	focus: brightGreen,

	contentWidth: contentWidth,
};

export const LightTheme: DefaultTheme = {
	background: nearWhite,
	text: nearBlack,
	action: darkGreen,
	hover: green,
	active: nearBlack,
	focus: darkGreen,

	contentWidth: contentWidth,
};
