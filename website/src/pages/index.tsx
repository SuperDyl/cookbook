import React from "react";
import type { HeadFC, PageProps } from "gatsby";
import Layout from "../components/Layout";

const HomePage = ({}: PageProps) => {
	return (
		<>
			<Layout>
				<p>Testing</p>
			</Layout>
		</>
	);
};

export default HomePage;

export const Head: HeadFC = () => <title>Cookbook - Sign in</title>;
