import styled, { keyframes } from "styled-components";

type OuterContainerProps = {
	$isOpen: boolean;
};

export const OuterContainer = styled.div<OuterContainerProps>`
	max-height: ${({ $isOpen }) => ($isOpen ? "500px" : "0")};
	overflow: hidden;
	transition: max-height 1.5s ease;
`;

export const InnerContainer = styled.div<OuterContainerProps>`
	transform: translateY(${({ $isOpen }) => ($isOpen ? "0" : "-3rem")});
	transition: transform 1.5s ease;
`;
