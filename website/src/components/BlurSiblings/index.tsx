import React, { ReactNode } from "react";
import { BlurSiblingsContainer } from "./styles";

export type BlurSiblingsProps = {
	children: ReactNode;
	className?: string;
};

export const BlurSiblings = ({ children, className }: BlurSiblingsProps) => (
	<BlurSiblingsContainer className={className}>
		{children}
	</BlurSiblingsContainer>
);
