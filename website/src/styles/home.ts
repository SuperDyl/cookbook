import { styled } from "styled-components";

export const CenteredContent = styled.div`
	display: flex;
	justify-content: center;

	position: absolute;
	top: 0;
	bottom: 0;
	right: 0;
	left: 0;

	margin-bottom: 10%;
`;

export const HomeContentBox = styled.div`
	max-width: ${({ theme }) => theme.contentWidth};
	margin: 4em 2em;
	display: flex;
	flex-direction: column;
	justify-content: center;

	flex: 1;
`;

export const Button = styled.button`
	margin: 10px 0;
	font-size: 1.25rem;
	padding: 0.5em 0;
`;

export const Svg = styled.svg`
	margin: 10px 0;
`;
