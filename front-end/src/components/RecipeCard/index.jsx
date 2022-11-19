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
      <DishTitle>{`Dish: ${dishName}`}</DishTitle>
      <p>{`Labels: ${labels.reduce(
        (curr, prev) => curr + ", " + prev,
        ""
      )}`}</p>
      <p>{`Description: ${desc}`}</p>
      <p>{`${totalTime}`}</p>
      <p>{`${ingredients}`}</p>
      <p>{`${steps}`}</p>
      <p>{`${notes}`}</p>
    </CardBody>
  );
}

export default memo(RecipeCard);
