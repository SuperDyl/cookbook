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
  EditButton,
} from "./styles";
import PencilIcon from "./pencil-icon.svg";

function DisplayRecipeCard({
  toggleEdit = () => {},
  dishName = "",
  labels = [],
  desc = "",
  totalTime,
  ingredients = [],
  steps = [],
  notes = "",
  printReady = false,
  ...rest
}) {
  return (
    <CardBody $hideBackground={printReady}>
      <TitleBox>
        <DishTitle>{dishName}</DishTitle>
        {!printReady && (
          <EditButton onClick={toggleEdit}>
            <img src={PencilIcon} width="20px" height="20px" alt="Edit Icon" />
          </EditButton>
        )}
      </TitleBox>
      {/* <p>{`Labels: ${labels.reduce(
        (curr, prev) => curr + ", " + prev,
        ""
      )}`}</p> */}
      <p>{desc}</p>
      <p>{totalTime}</p>
      <IngredientList>
        {ingredients.map((ingredient) => (
          <IngredientItem key={`ingredient-${ingredient}`}>
            {ingredient}
          </IngredientItem>
        ))}
      </IngredientList>
      <StepsList>
        {steps.map((step) => (
          <li key={`step-${step}`}>{step}</li>
        ))}
      </StepsList>
      <NotesText>{`${notes}`}</NotesText>
    </CardBody>
  );
}

export default memo(DisplayRecipeCard);
