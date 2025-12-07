"use client"

import React, {
  type ChangeEvent,
  type KeyboardEvent,
  use,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState } from "react";
import Layout from "@/components/Layout";
import Head from "next/head";
import {
  DishTitleTextInput,
  RecipeContainer,
  SavingText,
  SubtleTextAreaInput,
  SubtleTextInput } from "./styles";
import {
  CookbookApiV1,
  Ingredient,
  Instruction,
  parseUUID,
  Recipe } from "server-api";
import { type UUID } from "crypto";
import Link from "next/link";
import { apiBase } from "@/constants";
import { useDebounce } from "@/hooks/useDebounce";

type EditRecipesPageProps = {
  params: Promise<{
    recipeId: string,
  }>
};

enum PageStates {
  NETWORK_ERROR = 'NETWORK_ERROR',
  RECIPE_ID_PARSE_ERROR = 'RECIPE_ID_PARSE_ERROR',
  LOADED_AND_SAVED = 'LOADED_AND_SAVED',
  LOADING = 'LOADING',
  SAVING = 'SAVING',
}

export default function EditRecipePage({params}: EditRecipesPageProps) {
  const {recipeId: recipeIdString} = use(params);
  const recipeId = parseUUID(recipeIdString);

  const [pageState, setPageState] = useState<PageStates>(PageStates.LOADING);

  const [title, setTitle] = useState<string>("");
  const [author, setAuthor] = useState<string>("");
  const [url, setUrl] = useState<string>("");
  const [ingredients, setIngredients] = useState<Ingredient[]>([{
    id: crypto.randomUUID() as UUID,
    version: 0,
    sequence: 0,
    raw: "",
  }]);
  const [instructions, setInstructions] = useState<Instruction[]>([{
    id: crypto.randomUUID() as UUID,
    version: 0,
    sequence: 0,
    raw: "",
  }]);

  const titleRef = useRef<HTMLInputElement>(null);
  const authorRef = useRef<HTMLInputElement>(null);
  const urlRef = useRef<HTMLInputElement>(null);
  const ingredientsRef = useRef<HTMLTextAreaElement>(null);
  const instructionsRef = useRef<HTMLTextAreaElement>(null);

  const api = useMemo(() => new CookbookApiV1(apiBase), []);

  const saveRecipe = useCallback(
    async ({
        title: newTitle = title,
        author: newAuthor = author,
        url: newUrl = url,
        ingredients: newIngredients = ingredients,
        instructions: newInstructions = instructions
    }: {
      title?: string,
      author?: string,
      url?: string,
      ingredients?: Ingredient[],
      instructions?: Instruction[]
    }) => {
      if (recipeId === null) {
        console.warn("Reached an impossible state of saving a recipe with an invalid recipeId");
        return;
      }

      setPageState(PageStates.SAVING);

      await api.postRecipe({
        id: recipeId,
        version: 0,
        title: newTitle,
        author: newAuthor.length === 0 ? null:newAuthor,
        url: newUrl.length === 0 ? null:newUrl,
        ingredients: newIngredients,
        instructions: newInstructions,
      });

      setPageState(PageStates.LOADED_AND_SAVED);
    },
    [api, author, ingredients, instructions, recipeId, title, url]);

  const debouncedSaveRecipe = useDebounce(
    500,
    saveRecipe);

  const handleTitleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setTitle(e.currentTarget.value);
      debouncedSaveRecipe({title: e.currentTarget.value});
    },
    [debouncedSaveRecipe]);
  const handleAuthorChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setAuthor(e.currentTarget.value);
      debouncedSaveRecipe({author: e.currentTarget.value});
    }, [debouncedSaveRecipe]);
  const handleUrlChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setUrl(e.currentTarget.value);
      debouncedSaveRecipe({url: e.currentTarget.value});
    }, [debouncedSaveRecipe]);

  const ingredientsText = useMemo(
    () => ingredients.map((x) => x.raw).join('\n'),
    [ingredients]);

  const instructionsText = useMemo(
    () => instructions.map((x) => x.raw).join('\n'),
    [instructions]);

  const handleIngredients = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      const newRaws = e.currentTarget.value.split('\n');
      const newIngredients: Ingredient[] = newRaws.map((raw, index) => {
          const ingredient: Ingredient = {
            id: crypto.randomUUID() as UUID,
            sequence: index,
            raw: raw,
            version: 0,
          };
          return ingredient;
      })

      setIngredients(newIngredients);
      debouncedSaveRecipe({ingredients: newIngredients});
    },
    [debouncedSaveRecipe]);

  const handleInstructions = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      const newRaws = e.currentTarget.value.split('\n');
      const newInstructions: Instruction[] = newRaws.map((raw, index) => {
          const instruction: Instruction = {
            id: crypto.randomUUID() as UUID,
            sequence: index,
            raw: raw,
            version: 0,
          };
          return instruction;
      })

      setInstructions(newInstructions);
      debouncedSaveRecipe({instructions: newInstructions});
    },
    [debouncedSaveRecipe]);

  const onTitleKeydown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (["Enter", "ArrowDown"].includes(e.key)) {
        authorRef?.current?.focus();
      }
    },
    []);

  const onAuthorKeydown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (["ArrowUp"].includes(e.key)) {
        titleRef?.current?.focus();
      } else if (["Enter", "ArrowDown"].includes(e.key)) {
        urlRef?.current?.focus();
      }
    },
    []);

  const onUrlKeydown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (["ArrowUp"].includes(e.key)) {
        authorRef?.current?.focus();
      } else if (["Enter", "ArrowDown"].includes(e.key)) {
        e.preventDefault();
        ingredientsRef?.current?.focus();
      }
    },
    []);

  const onIngredientsKeydown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "ArrowUp" && e.currentTarget.selectionStart === 0) {
        urlRef?.current?.focus();
      } else if (e.key === "ArrowDown" && e.currentTarget.selectionStart === e.currentTarget.value.length) {
        instructionsRef?.current?.focus();
      }
    },
    []);

  const onInstructionsKeydown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "ArrowUp" && e.currentTarget.selectionStart === 0) {
        ingredientsRef?.current?.focus();
      }
    },
    []);

  useEffect(
    () => {
      async function getRecipe() {
        if (recipeId === null) {
          setPageState(PageStates.RECIPE_ID_PARSE_ERROR);
          return;
        }

        let recipe: Recipe | null;
        try {
          recipe = await api.getRecipe(recipeId);
        } catch (e: unknown) {
          console.error(e);
          setPageState(PageStates.NETWORK_ERROR);
          return;
        }

        if (recipe !== null) {
          setTitle(recipe.title);
          setAuthor(recipe.author ?? '');
          setUrl(recipe.url ?? '');
          setIngredients(recipe.ingredients);
          setInstructions(recipe.instructions);
        }

        setPageState(PageStates.LOADED_AND_SAVED);
      }

      getRecipe();
    },
    [api, recipeId]);

  return (
    <>
      <Head>
        <title>Recipes-Cookbook</title>
      </Head>
      <Layout>
      <Link href="/recipes">Go Back</Link>
      {pageState === PageStates.NETWORK_ERROR &&
        <>
          <p>Encountered a networking error!</p>
          <Link href='/recipe/new'>Create New Recipe</Link>
        </>
      }
      {pageState === PageStates.RECIPE_ID_PARSE_ERROR &&
        <>
          <p>The provided recipe is invalid!</p>
          <Link href='/recipe/new'>Create New Recipe</Link>
        </>
      }
      {[PageStates.LOADED_AND_SAVED, PageStates.LOADING, PageStates.SAVING].includes(pageState) &&
        <>
          <RecipeContainer>
              <DishTitleTextInput
                type="text"
                placeholder="Dish"
                value={title}
                onChange={handleTitleChange}
                onKeyDown={onTitleKeydown}
                ref={titleRef}
                disabled={pageState === PageStates.LOADING}/>
              <SubtleTextInput
                type="text"
                placeholder="Author"
                value={author}
                onChange={handleAuthorChange}
                onKeyDown={onAuthorKeydown}
                ref={authorRef}
                disabled={pageState === PageStates.LOADING}/>
              <SubtleTextInput
                type="text"
                placeholder="Url"
                value={url}
                onChange={handleUrlChange}
                onKeyDown={onUrlKeydown}
                ref={urlRef}
                disabled={pageState === PageStates.LOADING}/>
              <SubtleTextAreaInput
                placeholder="Ingredients"
                value={ingredientsText}
                onChange={e => handleIngredients(e)}
                onKeyDown={onIngredientsKeydown}
                ref={ingredientsRef}
                disabled={pageState === PageStates.LOADING}/>
              <SubtleTextAreaInput
                placeholder="Instructions"
                value={instructionsText}
                onChange={e => handleInstructions(e)}
                onKeyDown={onInstructionsKeydown}
                ref={instructionsRef}
                disabled={pageState === PageStates.LOADING}/>
              <SavingText $visible={pageState === PageStates.SAVING}>Saving...</SavingText>
          </RecipeContainer>
        </>
      }
      </Layout>
    </>
  );
}
