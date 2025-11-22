import styled from "styled-components";

export const SubtleTextInput = styled.input`
    &[type="text"] {
        font-family: unset;
        border: none;
        outline: 0.5px ${({theme}) => theme.textCompliment} solid;

        margin: 0;
        border-radius: 0;
    }
`;

export const RecipeSpace = styled.div`
    display: flex;
    flex-direction: column;
    margin: 2rem;
`;