"use client"

import React, { useEffect, useMemo, useState } from "react";
import Layout from "@/components/Layout";
import { CookbookApiV1, type RecipeStub } from "server-api";
import Head from "next/head";
import Link from "next/link";
import { apiBase } from "@/constants";

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<RecipeStub[] | null>(null);

  const api = useMemo(() => new CookbookApiV1(apiBase), []);

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
        <nav>
          <p><Link href="/">Home</Link></p>
          <p><Link href="/recipe/new">New Recipe</Link></p>
        </nav>

        <ul>
          {recipes?.map(recipe =>
            <li key={recipe.id}>
              <Link href={`/recipe/${recipe.id}`}>
                {recipe.title}
              </Link>
            </li>
          )}
        </ul>
      </Layout>
    </>
  );
}
