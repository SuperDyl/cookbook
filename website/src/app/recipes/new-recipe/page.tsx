"use client"

import React from "react";
import Layout from "@/components/Layout";
import Head from "next/head";
import { Button } from "@/app/styles";
import { RecipeSpace, SubtleTextInput } from "./styles";

export default function NewRecipePage() {

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
            <SubtleTextInput type="text" placeholder="Ingredients"></SubtleTextInput>
            <SubtleTextInput type="text" placeholder="Instructions"></SubtleTextInput>
            <Button>Save</Button>
        </RecipeSpace>
      </Layout>
    </>
  );
}
