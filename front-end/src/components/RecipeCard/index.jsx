import React from "react";
import { memo, useState } from "react";
import DisplayRecipeCard from "../DisplayRecipeCard";
import EditRecipeCard from "../EditRecipeCard";

function RecipeCard(params) {
  const [editMode, setEditMode] = useState(false);

  const toggleEdit = () => {
    setEditMode(curr => !curr);
  };

  return editMode
    ? <EditRecipeCard toggleEdit={toggleEdit} {...params} />
    : <DisplayRecipeCard toggleEdit={toggleEdit} {...params} />;
}

export default memo(RecipeCard);
