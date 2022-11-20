import React from "react";
import { memo } from "react";
import { CardBody, DishTitle } from "./styles";

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
      <ul>
        {ingredients.map(ingredient =>
          <li key={`ingredient-${ingredient}`}>
            {ingredient}
          </li>
        )}
      </ul>
      <ol>
        {steps.map(step =>
          <li key={`step-${step}`}>
            {step}
          </li>
        )}
      </ol>
      <p>
        <b>{`${notes}`}</b>
      </p>
    </CardBody>
  );
}

export default memo(RecipeCard);
