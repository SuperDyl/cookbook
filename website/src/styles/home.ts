import { styled } from "styled-components";
import { BlurSiblings } from "../components/BlurSiblings";

export const CenteredContent = styled.div`
	min-height: 100vh;

	display: grid;
	justify-content: center;
	align-items: center;
	grid-template-columns: 1fr min(65ch, 100vw) 1fr;
`;

export const HomeContentBox = styled.div`
	margin: 4em 2em;
	display: flex;
	flex-direction: column;
	grid-column: 2;
	justify-content: center;
`;

export const Button = styled.button`
	margin: 10px 0;
	font-size: 1.25rem;
	padding: 0.5em 0;
`;

export const Svg = styled.svg`
	margin: 10px 0;
	min-height: 4em;
`;

export const StyledBlurSiblings = styled(BlurSiblings)`
	display: flex;
	flex-direction: column;
`;
