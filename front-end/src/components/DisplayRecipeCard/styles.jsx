import styled from "styled-components";
import IconButton from "../IconButton";

export const CardBody = styled.div`
  text-align: left;
  padding: 16px;
  margin: 24px;
  ${({ $hidebackground }) =>
    !$hidebackground && `background-color: #ffd3d0;`} border: red thick solid;
  border-radius: 30px;
`;

export const TitleBox = styled.span`
  display: flex;
  justify-content: space-between;
`;

export const DishTitle = styled.h2`
  margin: 0;
  display: inline;
`;

export const IngredientList = styled.ul`
  padding-left: 0;
  margin-left: 20px;
  list-style-type: disc;
`;

export const IngredientItem = styled.li`font-style: italic;`;

export const StepsList = styled.ol`
  padding-left: 0;
  margin-left: 24px;
`;

export const NotesText = styled.p`font-weight: bold;`;

export const EditButton = IconButton;
