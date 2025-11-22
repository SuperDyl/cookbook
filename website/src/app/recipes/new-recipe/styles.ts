import styled from "styled-components";

export const SubtleTextInput = styled.input`
    &[type="text"] {
        font-family: unset;
        border: 0.5px ${({theme}) => theme.textCompliment} solid;
        max-width: fit-content;
        field-sizing: content;
    }
`;

export const RecipeSpace = styled.div`
    display: flex;
    flex-direction: column;
    margin: 2rem;
`;