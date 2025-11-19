import * as React from "react";

// see https://www.gatsbyjs.com/docs/how-to/custom-configuration/typescript/#gatsby-browsertsx--gatsby-ssrtsx

export const onRenderBody = ({ setHeadComponents}: any) => {
	setHeadComponents([
		<link
			rel="preload"
			href="/fonts/lora/lora-variable.ttf"
			as="font"
			type="font/ttf"
			crossOrigin="anonymous"
			key="lora"
		/>,
	]);
};
