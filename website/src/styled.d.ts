import "styled-components";

declare module "styled-components" {
	export interface DefaultTheme {
		background: string;
		text: string;

		action: string;
		hover: string;
		active: string;
		focus: string;

		contentWidth: string;
	}
}
