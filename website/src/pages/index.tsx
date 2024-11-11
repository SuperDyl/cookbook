import React from "react";
import type { HeadFC, PageProps } from "gatsby";
import Layout from "../components/Layout";
import { HomeContentBox, Button, Svg, CenteredContent } from "../styles/home";

const HomePage = ({}: PageProps) => {
	return (
		<>
			<Layout>
				<CenteredContent>
					<HomeContentBox>
						<Svg viewBox="0 0 67 16">
							<text
								x="0"
								y="12"
							>
								Cookbook
							</text>
						</Svg>
						<Button>Login</Button>
						<Button>Register</Button>
					</HomeContentBox>
				</CenteredContent>
			</Layout>
		</>
	);
};

export default HomePage;

export const Head: HeadFC = () => <title>Home-Cookbook</title>;
