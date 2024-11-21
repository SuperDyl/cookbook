import React, { ReactNode } from "react";
import { InnerContainer, OuterContainer } from "./styles";

export type DrawerProps = {
	children?: ReactNode;
	className?: string;
	style?: object;

	isOpen: boolean;
};

export const Drawer = ({ children, className, style, isOpen }: DrawerProps) => {
	return (
		<OuterContainer
			$isOpen={isOpen}
			style={style}
			className={className}
		>
			<InnerContainer $isOpen={isOpen}>{children}</InnerContainer>
		</OuterContainer>
	);
};
