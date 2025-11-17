import React, { useState } from "react";
import type { HeadFC, PageProps } from "gatsby";
import Layout from "../components/Layout";
import {
	HomeContentBox,
	Button,
	Svg,
	CenteredContent,
	ButtonContainer,
} from "../styles/home";
import { FormLogin } from "../components/FormLogin";
import { Drawer } from "../components/Drawer";
import { FormRegister } from "../components/FormRegister";

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
							<FormLogin cancelAction={() => setLoginOpen(false)} />
						</Drawer>
						<Drawer isOpen={registerOpen}>
							<FormRegister cancelAction={() => setRegisterOpen(false)} />
						</Drawer>
						<Drawer isOpen={!(loginOpen || registerOpen)}>
							<ButtonContainer>
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
							</ButtonContainer>
						</Drawer>
						<a href="./recipes">Recipes</a>
					</HomeContentBox>
				</CenteredContent>
			</Layout>
		</>
	);
};

export default HomePage;

export const Head: HeadFC = () => <title>Home-Cookbook</title>;
