import React from "react";
import { memo, useState } from "react";
import {
  FullWindow,
  Header,
  Footer,
  MainContent,
  Text,
  ReadingPane,
  LabelBar
} from "./styles";
import RecipeCard from "../../components/RecipeCard";

function MainPage() {
  const [allRecipes, setAllRecipes] = useState([]);
  const [error, setError] = useState("");

  const fetchAllRecipes = async () => {
    try {
      const response = await axios.get("/api/recipes");
      setAllRecipes(response.data);
    } catch (error) {
      setError("error retrieving tasks: " + error);
    }
  };

  return (
    <FullWindow>
      <Header>Header</Header>
      <LabelBar>LabelBar</LabelBar>
      <MainContent>
        <ReadingPane>
          <RecipeCard />
        </ReadingPane>
      </MainContent>
      <Footer>Footer </Footer>
    </FullWindow>
  );
}

export default memo(MainPage);
