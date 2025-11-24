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

export const DishTitleTextInput = styled(SubtleTextInput)`
    &[type="text"] {
        font-size: 1.8rem;
    }
`;

export const RecipeContainer = styled.div`
    display: flex;
    flex-direction: column;
    margin: 2rem;
`;

export const IngredientContainer = styled.div`
    display: flex;
    flex-direction: column;

    padding: 1rem 0 .75rem 0;
`;

export const InstructionContainer = styled.div`
    display: flex;
    flex-direction: column;

    padding: 0.75rem 0 0.5rem 0;
`;