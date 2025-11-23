"use client"

import React, { useEffect, useMemo, useState } from "react";
import Layout from "@/components/Layout";
import { CookbookApiV1, type RecipeStub } from "server-api";
import Head from "next/head";

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<RecipeStub[] | null>(null);

  const api = useMemo(() => new CookbookApiV1("http://localhost:3001"), []);

  useEffect(() => {
    async function fetchRecipeStubs(): Promise<void> {
      try {
        await setRecipes(await api.getRecipeStubs());
      }
      catch (e: unknown) {
        console.error(e);
      }
    }

    fetchRecipeStubs();
  }, [api]);

  return (
    <>
      <Head>
        <title>Recipes-Cookbook</title>
      </Head>
      <Layout>
        <a href="/recipes/new-recipe">New Recipe</a>
        <ul>
        </ul>
      </Layout>
    </>
  );
}
