import React from "react";
import { memo } from "react";
import {
  CardBody,
  DishTitle,
  IngredientList,
  IngredientItem,
  StepsList,
  NotesText
} from "./styles";

function RecipeCard({
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
      <DishTitle>
        {dishName}
      </DishTitle>
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

export default memo(RecipeCard);
