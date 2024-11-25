import styled from "styled-components";

type InnerContainerProps = {
	$isOpen: boolean;
};

export const OuterContainer = styled.div`
	overflow: hidden;
	transition: max-height 0.75s ease;
`;

export const InnerContainer = styled.div<InnerContainerProps>`
	opacity: ${({ $isOpen }) => ($isOpen ? "100%" : "0")};
	transition: transform, opacity 0.75s ease;
	display: flow-root;
`;
