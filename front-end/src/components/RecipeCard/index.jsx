import React from "react";
import { memo, useState } from "react";
import DisplayRecipeCard from "../DisplayRecipeCard";
import EditRecipeCard from "../EditRecipeCard";

function RecipeCard({ putRecipe, deleteRecipe, ...params }) {
  const [editMode, setEditMode] = useState(false);

  const toggleEdit = () => {
    setEditMode(curr => !curr);
  };

  const saveEdit = saveItems => {
    putRecipe(saveItems._id, saveItems);
    toggleEdit();
  };

  return editMode
    ? <EditRecipeCard
        toggleEdit={toggleEdit}
        saveEdit={saveEdit}
        deleteRecipe={deleteRecipe}
        {...params}
      />
    : <DisplayRecipeCard toggleEdit={toggleEdit} {...params} />;
}

export default memo(RecipeCard);
