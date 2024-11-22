import React, { ReactNode, useLayoutEffect, useRef, useState } from "react";
import { InnerContainer, OuterContainer } from "./styles";

export type DrawerProps = {
	children?: ReactNode;
	className?: string;
	style?: object;

	isOpen: boolean;
};

export const Drawer = ({ children, className, style, isOpen }: DrawerProps) => {
	const innerRef = useRef<HTMLDivElement>(null);
	const [height, setHeight] = useState(isOpen ? 500 : 0);

	useLayoutEffect(() => {
		if (isOpen) {
			setHeight(innerRef.current?.scrollHeight || height);
		} else {
			setHeight(0);
		}
	}, [isOpen]);

	return (
		<OuterContainer
			style={{ ...style, maxHeight: `${height}px` }}
			className={className}
		>
			<InnerContainer
				$isOpen={isOpen}
				ref={innerRef}
			>
				{children}
			</InnerContainer>
		</OuterContainer>
	);
};
