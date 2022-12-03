import React from "react";
import { memo, useState, useLayoutEffect } from "react";
import {
  FullWindow,
  Header,
  Footer,
  MainContent,
  ReadingPane,
  Toolbar,
  StyledIconButton
} from "./styles";
import RecipeCard from "../../components/RecipeCard";
import FloatingAddButton from "../../components/FloatingAddButton";
import axios from "axios";
import PrinterIcon from "./printer.svg";

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
      const response = await axios.post(`/api/recipes`, recipeData);
      console.log("post response: ", response);
      setAllRecipes([...allRecipes, { recipeData, ...response.data.recipe }]);
      console.log(allRecipes);
    } catch (error) {
      console.log("Failed to post!");
      setError("error posting recipe: " + error);
    }
  };

  const deleteRecipe = async _id => {
    try {
      console.log("Tried to put!!");
      await axios.delete(`/api/recipes/${_id}`);
      const allRecipesCopy = allRecipes.filter(({ _id: id }) => id !== _id);
      setAllRecipes(allRecipesCopy);
    } catch (error) {
      setError("error udpating recipe: " + error);
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
          <Toolbar>
            <StyledIconButton>
              <img src={PrinterIcon} height="20px" width="20px" />
            </StyledIconButton>
          </Toolbar>
          {allRecipes.map(recipeData =>
            <RecipeCard
              {...recipeData}
              putRecipe={putRecipe}
              deleteRecipe={deleteRecipe}
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
