import { keyframes, styled } from "styled-components";

const toggleBlur = keyframes`
  from {
    filter: none;
  }

  to {
    filter: blur(1px);
  }
`;

export const BlurSiblingsContainer = styled.div`
	@media (prefers-reduced-motion: no-preference) and (prefers-reduced-transparency: no-preference) and (any-hover: hover) {
		&:hover > *:not(:hover) {
			animation: ${toggleBlur} 2500ms ease;
			animation-direction: alternate;
			animation-fill-mode: both;
			animation-play-state: running;
		}

		& > *:hover {
			animation-play-state: paused;
		}
	}
`;
