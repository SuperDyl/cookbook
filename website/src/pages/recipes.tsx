import React, { useEffect, useState } from "react";
import type { HeadFC, PageProps } from "gatsby";
import Layout from "../components/Layout";
import { CookbookApiV1, type Recipe } from "server-api";

const RecipesPage = ({}: PageProps) => {

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
			<Layout>
                <ul>

                </ul>
			</Layout>
		</>
	);
};

export default RecipesPage;

export const Head: HeadFC = () => <title>Recipes-Cookbook</title>;
