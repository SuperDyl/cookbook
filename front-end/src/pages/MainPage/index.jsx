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

  useLayoutEffect(() => {
    fetchAllRecipes();
  }, []);

  return (
    <FullWindow>
      <Header>Recipes Database</Header>{" "}
      <MainContent>
        <ReadingPane>
          {allRecipes.map(recipeData => <RecipeCard {...recipeData} />)}
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
