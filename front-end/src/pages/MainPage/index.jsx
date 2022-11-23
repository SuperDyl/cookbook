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
import FloatingAddButton from "../../components/FloatingAddButton";
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
      setError("error retrieving recipes: " + error);
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
      setError("error udpating recipe: " + error);
    }
  };

  const postRecipe = async recipeData => {
    try {
      console.log("Tried to post!!");
      await axios.post(`/api/recipes`, recipeData);
      setAllRecipes([...allRecipes, recipeData]);
    } catch (error) {
      setError("error posting recipe: " + error);
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
          <FloatingAddButton onClick={() => postRecipe({})} />
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
