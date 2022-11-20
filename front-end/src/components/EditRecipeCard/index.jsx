import React from "react";
import { memo } from "react";
import {
  CardBody,
  DishTitle,
  IngredientList,
  IngredientItem,
  StepsList,
  NotesText,
  TitleBox,
  CancelEditButton,
  SaveEditButton,
  EditButtonGroup
} from "./styles";
import PencilIcon from "./pencil-icon.svg";

function EditRecipeCard({
  toggleEdit = () => {},
  dishName = "",
  labels = [],
  desc = "",
  totalTime,
  ingredients = [],
  steps = [],
  notes = "",
  id,
  ...rest
}) {
  console.log("Labels: ", labels);
  console.log("REST: ", rest);

  function saveEdit() {
    toggleEdit();
  }

  return (
    <CardBody>
      <TitleBox>
        <span>
          <DishTitle>
            {`Edit: `}
          </DishTitle>
          <DishTitle contentEditable="true">
            {dishName}
          </DishTitle>
        </span>
      </TitleBox>
      {/* <p>{`Labels: ${labels.reduce(
        (curr, prev) => curr + ", " + prev,
        ""
      )}`}</p> */}
      <p>
        {desc}
      </p>
      <p>
        {totalTime}
      </p>
      <IngredientList>
        {ingredients.map(ingredient =>
          <IngredientItem key={`ingredient-${ingredient}`}>
            {ingredient}
          </IngredientItem>
        )}
      </IngredientList>
      <StepsList>
        {steps.map(step =>
          <li key={`step-${step}`}>
            {step}
          </li>
        )}
      </StepsList>
      <NotesText>
        {`${notes}`}
      </NotesText>
      <EditButtonGroup>
        <CancelEditButton onClick={toggleEdit}>Cancel Edit</CancelEditButton>
        <SaveEditButton onClick={saveEdit}>Save Edit</SaveEditButton>
      </EditButtonGroup>
    </CardBody>
  );
}

export default memo(EditRecipeCard);
