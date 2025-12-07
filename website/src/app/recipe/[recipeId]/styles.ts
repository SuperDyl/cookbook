import styled, {css} from "styled-components";

const SubtleInput = css`
    font-family: unset;
    border: none;
    outline: 0.5px ${({theme}) => theme.textCompliment} solid;

    margin: 0;
    border-radius: 0;

    &:focus-visible {
        outline: 2px ${({theme}) => theme.focus} solid;
    }
`;

export const SubtleTextInput = styled.input`
    &[type="text"] {
        ${SubtleInput}
    }
`;

export const DishTitleTextInput = styled(SubtleTextInput)`
    &[type="text"] {
        font-size: 1.8rem;
    }
`;

export const SubtleTextAreaInput = styled.textarea`
    ${SubtleInput}

    &:focus-visible {
        border-radius: 0;
    }
`;

export const RecipeContainer = styled.div`
    display: flex;
    flex-direction: column;
    margin: 2rem;
`;

export type SavingTextProps = {
    $visible: boolean,
};

export const SavingText = styled.h2<SavingTextProps>`
    transition: opacity .5s;
    opacity: ${({$visible}) => $visible ? 100:0};
`;