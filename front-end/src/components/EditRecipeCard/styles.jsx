import styled from "styled-components";
import { css } from "styled-components";

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

const EditableField = css`
  background-color: white;
  border-radius: 10px;
  padding: 2px 10px;`;

export const EditableText = styled.p`${EditableField};`;

export const TitleBox = DisplayTitleBox;

export const DishTitleHeader = DisplayDishTitle;

export const DishTitle = styled(DishTitleHeader)`
  ${EditableField}
`;

export const IngredientList = DisplayIngredientList;

export const IngredientItem = styled(DisplayIngredientItem)`
  ${EditableField}
`;

export const StepsList = DisplayStepsList;

export const StepsListItem = styled.li`${EditableField};`;

export const NotesText = styled(DisplayNotesText)`
  ${EditableField}
`;

export const CancelEditButton = styled(DisplayEditButton)`
  margin: 2px;
  padding: 8px;
  border: solid black 2px;
  font-size: 16px;
  background: #d7d7d7;
  border-radius: 10px;

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
