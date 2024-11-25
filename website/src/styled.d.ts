import "styled-components";

declare module "styled-components" {
	export interface DefaultTheme {
		background: string;
		backgroundCompliment: string;
		text: string;
		textCompliment: string;

		action: string;
		hover: string;
		active: string;
		focus: string;

		disabled: string;

		contentWidth: string;
	}
}
