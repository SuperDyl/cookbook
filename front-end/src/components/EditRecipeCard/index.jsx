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
  EditButton
} from "./styles";
import PencilIcon from "./pencil-icon.svg";

function EditRecipeCard({
  dishName = "",
  labels = [],
  desc = "",
  totalTime,
  ingredients = [],
  steps = [],
  notes = "",
  ...rest
}) {
  console.log("Labels: ", labels);
  console.log("REST: ", rest);

  return (
    <CardBody>
      <TitleBox>
        <DishTitle>
          {dishName}
        </DishTitle>
        {false
          ? <EditButton>
              <img src={PencilIcon} width="20px" height="20px" />
            </EditButton>
          : <span />}
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
    </CardBody>
  );
}

export default memo(EditRecipeCard);
