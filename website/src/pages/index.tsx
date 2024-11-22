import React, { useState } from "react";
import type { HeadFC, PageProps } from "gatsby";
import Layout from "../components/Layout";
import {
	HomeContentBox,
	Button,
	Svg,
	CenteredContent,
	StyledBlurSiblings,
} from "../styles/home";
import { LoginForm } from "../components/LoginForm";
import { Drawer } from "../components/Drawer";

const HomePage = ({}: PageProps) => {
	const [loginOpen, setLoginOpen] = useState(false);
	const [registerOpen, setRegisterOpen] = useState(false);

	return (
		<>
			<Layout>
				<CenteredContent>
					<HomeContentBox>
						<Svg viewBox="0 0 76 17">
							<text
								x="0"
								y="12"
							>
								Cookbook
							</text>
						</Svg>
						<Drawer isOpen={loginOpen}>
							<LoginForm cancelAction={() => setLoginOpen(false)} />
						</Drawer>
						<Drawer isOpen={registerOpen}>
							<LoginForm cancelAction={() => setRegisterOpen(false)} />
						</Drawer>
						<Drawer isOpen={!(loginOpen || registerOpen)}>
							<StyledBlurSiblings>
								<Button
									onClick={() => {
										setLoginOpen(!loginOpen);
										setRegisterOpen(false);
									}}
								>
									Login
								</Button>
								<Button
									onClick={() => {
										setLoginOpen(false);
										setRegisterOpen(!registerOpen);
									}}
								>
									Register
								</Button>
							</StyledBlurSiblings>
						</Drawer>
					</HomeContentBox>
				</CenteredContent>
			</Layout>
		</>
	);
};

export default HomePage;

export const Head: HeadFC = () => <title>Home-Cookbook</title>;
