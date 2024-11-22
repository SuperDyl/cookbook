import styled, { keyframes } from "styled-components";

type InnerContainerProps = {
	$isOpen: boolean;
};

export const OuterContainer = styled.div`
	overflow: hidden;
	transition: max-height 1.5s ease;
`;

export const InnerContainer = styled.div<InnerContainerProps>`
	transform: translateY(${({ $isOpen }) => ($isOpen ? "0" : "-3rem")});
	transition: transform 1.5s ease;
	display: flow-root;
`;
