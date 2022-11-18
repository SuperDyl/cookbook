import React from "react";
import { memo } from "react";

function RecipeCard({
  dishName = "",
  labels = [],
  desc = "",
  totalTime,
  ingredients = [],
  steps = [],
  notes = ""
}) {
  return (
    <div>
      <p>{`Dish: ${dishName}`}</p>
      <p>{`${labels}`}</p>
      <p>{`${desc}`}</p>
      <p>{`${totalTime}`}</p>
      <p>{`${ingredients}`}</p>
      <p>{`${steps}`}</p>
      <p>{`${notes}`}</p>
      <p>testing 2</p>
    </div>
  );
}

export default memo(RecipeCard);
