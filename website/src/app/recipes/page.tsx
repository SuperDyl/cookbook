"use client"

import React, { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { CookbookApiV1, type Recipe } from "server-api";
import Head from "next/head";

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[] | null>(null);

  const api = new CookbookApiV1("https://cookbook.superdyl.net/api/v1");

  useEffect(() => {
    async function fetchRecipes(): Promise<void> {
      try {
        await setRecipes(await api.getRecipes());
      }
      catch (e: unknown) {
        console.error(e);
      }
    }

    fetchRecipes();
  }, []);

  return (
    <>
      <Head>
        <title>Recipes-Cookbook</title>
      </Head>
      <Layout>
        <a href="./new">New Recipe</a>
        <ul>
        </ul>
      </Layout>
    </>
  );
}
