import "styled-components";

declare module "styled-components" {
	export interface DefaultTheme {
		background: string;
		backgroundCompliment: string;
		text: string;

		action: string;
		hover: string;
		active: string;
		focus: string;

		contentWidth: string;
	}
}
