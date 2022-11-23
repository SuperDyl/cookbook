import styled from "styled-components";

import {
  CardBody as DisplayCardBody,
  TitleBox as DisplayTitleBox,
  DishTitle as DisplayDishTitle,
  IngredientList as DisplayIngredientList,
  IngredientItem as DisplayIngredientItem,
  StepsList as DisplayStepsList,
  NotesText as DisplayNotesText,
  EditButton as DisplayEditButton
} from "../DisplayRecipeCard/styles";

export const CardBody = styled(DisplayCardBody)`
  border-style: solid;
`;

export const TitleBox = DisplayTitleBox;

export const DishTitle = DisplayDishTitle;

export const IngredientList = DisplayIngredientList;

export const IngredientItem = DisplayIngredientItem;

export const StepsList = DisplayStepsList;

export const NotesText = DisplayNotesText;

export const CancelEditButton = styled(DisplayEditButton)`
  margin: 2px;
  padding: 8px;
  border: solid black 2px;
  font-size: 16px;
  background: #d7d7d7;

  :hover {
    border: solid black 2px;
    font-weight: bold;
  }
`;

export const SaveEditButton = styled(CancelEditButton)`
  background-color: #7cde81;
`;

export const DeleteCardButton = styled(CancelEditButton)`
  background-color: #e27373;
`;

export const EditButtonGroup = styled.span`
  display: flex;
  justify-content: space-around;
`;
