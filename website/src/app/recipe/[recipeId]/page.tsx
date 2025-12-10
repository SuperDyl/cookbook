"use client"

import React, { use } from "react";
import Layout from "@/components/Layout";
import Head from "next/head";
import { parseUUID } from "server-api";
import Link from "next/link";
import RecipeSection from "@/sections/RecipeSection";

type EditRecipesPageProps = {
  params: Promise<{
    recipeId: string,
  }>
};

export default function EditRecipePage({params}: EditRecipesPageProps) {
  const {recipeId: recipeIdString} = use(params);
  const recipeId = parseUUID(recipeIdString);

  return (
      <Layout>
        <Head>
          <title>Recipes-Cookbook</title>
        </Head>
        <nav>
          <p><Link href="/">Home</Link></p>
          <p><Link href="/recipes">See all recipes</Link></p>
        </nav>
        {recipeId === null
          ? <>
              <p>The provided recipe is invalid!</p>
              <Link href='/recipe/new'>Create New Recipe</Link>
            </>
          : <RecipeSection recipeId={recipeId}/> }
      </Layout>
  );
}
