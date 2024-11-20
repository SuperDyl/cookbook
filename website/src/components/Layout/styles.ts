import styled from "styled-components";

export const Background = styled.div`
	width: 100vw;
	height: 100vh;
	background-color: ${({ theme }) => theme.background};
	margin: 0;

	background-image: linear-gradient(
		150deg,
		${({ theme }) => theme.backgroundCompliment} 0%,
		${({ theme }) => theme.background} 100%
	);

	position: absolute;
	overflow: auto;
`;
