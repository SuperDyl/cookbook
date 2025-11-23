"use client"

import React, { useState } from "react";
import Layout from "@/components/Layout";
import Head from "next/head";
import { Button } from "@/app/styles";
import { IngredientContainer, RecipeSpace, SubtleTextInput } from "./styles";
import { Ingredient } from "server-api";

export default function NewRecipePage() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);

  return (
    <>
      <Head>
        <title>Recipes-Cookbook</title>
      </Head>
      <Layout>
        <a href="/recipes">Go Back</a>
        <RecipeSpace>
            <SubtleTextInput
              type="text"
              placeholder="Dish"
              style={{
                fontSize: "1.8rem",
                fieldSizing: "content",
              }}/>
            <SubtleTextInput type="text" placeholder="Subtitle"></SubtleTextInput>
            <SubtleTextInput type="text" placeholder="Author"></SubtleTextInput>
            <IngredientContainer>
              {ingredients.map(ingredient => <SubtleTextInput type="text" placeholder="Ingredients" key={ingredient.id}></SubtleTextInput>)}
              <SubtleTextInput type="text" placeholder="Ingredients"></SubtleTextInput>
            </IngredientContainer>
            <SubtleTextInput type="text" placeholder="Instructions"></SubtleTextInput>
            <Button>Save</Button>
        </RecipeSpace>
      </Layout>
    </>
  );
}
