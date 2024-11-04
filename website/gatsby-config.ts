import type { GatsbyConfig } from "gatsby";

const config: GatsbyConfig = {
	siteMetadata: {
		title: `superdyl-cookbook`,
		siteUrl: `https://cookbook.superdyl.net`,
		description: `Upload, share, edit, and print your recipes`,
	},
	plugins: ["gatsby-plugin-styled-components"],
};

export default config;
