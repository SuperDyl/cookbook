import React from "react";
import { memo, useState, useLayoutEffect } from "react";
import {
  FullWindow,
  Header,
  Footer,
  MainContent,
  Text,
  ReadingPane
} from "./styles";
import RecipeCard from "../../components/RecipeCard";
import axios from "axios";

function MainPage() {
  const [allRecipes, setAllRecipes] = useState([]);
  const [error, setError] = useState("");

  const fetchAllRecipes = async () => {
    try {
      console.log("Tried to fetch!!");
      const response = await axios.get("/api/recipes");
      setAllRecipes(response.data.recipes);
      console.log("allRecipes: ", response.data.recipes);
    } catch (error) {
      setError("error retrieving tasks: " + error);
    }
  };

  const putRecipe = async (_id, newData) => {
    try {
      console.log("Tried to put!!");
      await axios.put(`/api/recipes/${_id}`, newData);

      let allRecipesCopy = [...allRecipes];
      for (const index in allRecipes) {
        if (allRecipes[index]._id === _id) {
          allRecipesCopy[index] = newData;
          break;
        }
      }
      setAllRecipes(allRecipesCopy);
    } catch (error) {
      setError("error retrieving tasks: " + error);
    }
  };

  useLayoutEffect(() => {
    fetchAllRecipes();
  }, []);

  return (
    <FullWindow>
      <Header>Recipes Database</Header>{" "}
      <MainContent>
        <ReadingPane>
          {allRecipes.map(recipeData =>
            <RecipeCard
              {...recipeData}
              putRecipe={putRecipe}
              key={`card-${recipeData.dishName}`}
            />
          )}
        </ReadingPane>
      </MainContent>
      <Footer>
        By the Fabulous Ryan Harper and his sidekick Dylan Jones{" | "}
        <a href="https://github.com/SuperDyl/cookbook">GitHub</a>
      </Footer>
    </FullWindow>
  );
}

export default memo(MainPage);
