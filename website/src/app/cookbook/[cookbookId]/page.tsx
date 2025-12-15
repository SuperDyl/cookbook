"use client"

import React, {
  type ChangeEvent,
  type KeyboardEvent,
  use,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import Layout from "@/components/Layout";
import Head from "next/head";
import {
  CookbookTitleTextInput,
  RecipeContainer,
  SavingText,
  SubtleTextInput
} from "./styles";
import {
  CookbookApiV1,
  parseUUID,
  type Cookbook,
  type CookbookSection,
} from "server-api";
import { type UUID } from "crypto";
import Link from "next/link";
import { apiBase } from "@/constants";
import { DebounceStates, useDebounce } from "@/hooks/useDebounce";
import RecipeSection, { RecipeStates } from "@/sections/RecipeSection";
import useStopPageClose from "@/hooks/useStopPageClose";

type EditRecipesPageProps = {
  params: Promise<{
    cookbookId: string,
  }>
};

enum PageStates {
  COOKBOOK_ID_PARSE_ERROR = 'COOKBOOK_ID_PARSE_ERROR',
  FETCHING_DATA = 'FETCHING_DATA',
  NETWORK_ERROR = 'NETWORK_ERROR',
  EDITING = 'EDITING',
  SAVING = 'SAVING',
}

type WrappedRecipeSectionProps<T> = {
  recipeId: UUID,
  data: T,
  onChange: (data: T, newState: RecipeStates) => void,
};

function WrappedRecipeSection<T>({
  recipeId,
  data,
  onChange,
}: WrappedRecipeSectionProps<T>) {
  const wrappedOnChange = useCallback(
    (newState: RecipeStates) => onChange(data, newState),
    [data, onChange]
  );

  return <RecipeSection recipeId={recipeId} onChange={wrappedOnChange}/>
}

export default function EditCookbookPage({params}: EditRecipesPageProps) {
  const {cookbookId: cookbookIdString} = use(params);
  const cookbookId = parseUUID(cookbookIdString);

  const [pageState, setPageState] = useState<PageStates>(PageStates.FETCHING_DATA);

  const [title, setTitle] = useState<string>("");
  const [author, setAuthor] = useState<string>("");
  const [recipeIds, setRecipeIds] = useState<UUID[]>([]);
  const [sections, setSections] = useState<CookbookSection[]>([]);

  const [emptyRecipes, setEmptyRecipes] = useState<boolean[]>([]);

  // This prevents sending a post/delete immediately when the recipe loads
  const completedInitialLoad = useRef<boolean>(false);

  const titleRef = useRef<HTMLInputElement>(null);
  const authorRef = useRef<HTMLInputElement>(null);

  const handleDebounceChange = useCallback(
    (newState: DebounceStates) => {
      if (newState === DebounceStates.WAITING) {
        setPageState(PageStates.EDITING);
      } else if (newState !== DebounceStates.CANCELED) {
        setPageState(PageStates.SAVING);
      }
    },
    []);

  const api = useMemo(() => new CookbookApiV1(apiBase), []);

  const saveCookbook = useCallback(
    async ({
        title: newTitle,
        author: newAuthor,
        recipeIds: newRecipeIds,
        sections: newSections,
        emptyRecipes: newEmptyRecipes,
    }: {
      title: string,
      author: string,
      recipeIds: UUID[],
      sections: CookbookSection[],
      emptyRecipes: boolean[],
    }) => {
      if (cookbookId === null) {
        console.warn("Reached an impossible state of saving a recipe with an invalid recipeId");
        return;
      }

      const trimmedTitle = newTitle.trim();
      const trimmedAuthor = newAuthor.trim();
      const filteredRecipeIds = newRecipeIds.filter((_, index) => !newEmptyRecipes[index]);

      if (trimmedTitle.length === 0
        && trimmedAuthor.length === 0
        && newRecipeIds.length === 0
      ) {
        try {
          await api.deleteCookbook(cookbookId);
        }
        catch (e: unknown) {
          console.error(`Failed to delete cookbook=${cookbookId}`, e);
        }
        return;
      }

      const newCookbook: Cookbook = {
        id: cookbookId,
        version: 0,
        title: trimmedTitle,
        author: trimmedAuthor.length === 0 ? null : trimmedAuthor,
        recipeIds: filteredRecipeIds,
        sections: newSections,
      };
      try {
        await api.postCookbook(newCookbook);
      }
      catch (e: unknown) {
        console.error(`Failed to post cookbook=${cookbookId}`, e);
      }
    },
    [cookbookId, api]);

  const debouncedSaveCookbook = useDebounce(
    500,
    saveCookbook,
    handleDebounceChange,
  );

  const handleTitleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setTitle(e.currentTarget.value);
    },
    []);

  const handleAuthorChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setAuthor(e.currentTarget.value);
    }, []);

  const onTitleKeydown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (["Enter", "ArrowDown"].includes(e.key)) {
        e.preventDefault();
        authorRef?.current?.focus();
      }
    },
    []);

  const onAuthorKeydown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (["ArrowUp"].includes(e.key)) {
        e.preventDefault();
        titleRef?.current?.focus();
      }
    },
    []);

  const handleRecipeStateChange = useCallback(
    (index: number, newState: RecipeStates) => {
      setEmptyRecipes(oldEmptyRecipes => {
        const isRecipeEmpty = [RecipeStates.EMPTY, RecipeStates.SAVING_EMPTY].includes(newState);

        const newEmptyRecipes: boolean[] = [
          ...oldEmptyRecipes.slice(0, index),
          isRecipeEmpty,
          ...oldEmptyRecipes.slice(index + 1),
        ];

        return newEmptyRecipes;
      });
    },
    [],
  );

  const insertRecipe = useCallback(
    (index: number) => {
      setRecipeIds(oldRecipesIds => {
        const newRecipeIds: UUID[] = [
          ...oldRecipesIds.slice(0, index),
          crypto.randomUUID() as UUID,
          ...oldRecipesIds.slice(index + 1),
        ];

        return newRecipeIds;
      })

      setEmptyRecipes(oldEmptyRecipes => {
        const newEmptyRecipes: boolean[] = [
          ...oldEmptyRecipes.slice(0, index),
          true,
          ...oldEmptyRecipes.slice(index + 1),
        ];

        return newEmptyRecipes;
      });
    },
    []);

  useEffect(
    () => {
      async function getCookbook() {
        if (cookbookId === null) {
          setPageState(PageStates.COOKBOOK_ID_PARSE_ERROR);
          return;
        }

        let cookbook: Cookbook | null;
        try {
          cookbook = await api.getCookbook(cookbookId);
        } catch (e: unknown) {
          console.error(`Failed to fetch cookbook=${cookbookId}`, e);
          setPageState(PageStates.NETWORK_ERROR);
          return;
        }

        if (cookbook !== null) {
          setTitle(cookbook.title);
          setAuthor(cookbook.author ?? '');
          setRecipeIds(cookbook.recipeIds);
          setSections(cookbook.sections);
          setEmptyRecipes(cookbook.recipeIds.map(() => false));
        }

        setPageState(PageStates.EDITING);
      }

      getCookbook();
    },
    [api, cookbookId]);

  const isValidStateForSaving = ![
      PageStates.FETCHING_DATA,
      PageStates.COOKBOOK_ID_PARSE_ERROR,
      PageStates.NETWORK_ERROR]
    .includes(pageState);

  useEffect(
    () => {
      if (isValidStateForSaving) {
        if (!completedInitialLoad.current) {
          completedInitialLoad.current = true;
          return;
        }

        debouncedSaveCookbook({
          title,
          author,
          recipeIds,
          sections,
          emptyRecipes,
        });
      }
    },
    [author, debouncedSaveCookbook, emptyRecipes, recipeIds, sections, title, isValidStateForSaving]);

  useStopPageClose(pageState === PageStates.SAVING);

  return (
    <>
      <Head>
        <title>Recipes-Cookbook</title>
      </Head>
      <Layout>
      <Link href="/cookbooks">Go Back</Link>
      {pageState === PageStates.NETWORK_ERROR &&
        <>
          <p>Encountered a networking error!</p>
          <Link href='/recipe/new'>Create New Recipe</Link>
        </>
      }
      {pageState === PageStates.COOKBOOK_ID_PARSE_ERROR &&
        <>
          <p>The provided recipe is invalid!</p>
          <Link href='/recipe/new'>Create New Recipe</Link>
        </>
      }
      {[PageStates.EDITING, PageStates.FETCHING_DATA, PageStates.SAVING].includes(pageState) &&
        <>
          <RecipeContainer>
              <CookbookTitleTextInput
                type="text"
                placeholder={pageState === PageStates.FETCHING_DATA ?  "":"Cookbook Title"}
                value={title}
                onChange={handleTitleChange}
                onKeyDown={onTitleKeydown}
                ref={titleRef}
                disabled={pageState === PageStates.FETCHING_DATA}/>
              <SubtleTextInput
                type="text"
                placeholder={pageState === PageStates.FETCHING_DATA ?  "":"Author"}
                value={author}
                onChange={handleAuthorChange}
                onKeyDown={onAuthorKeydown}
                ref={authorRef}
                disabled={pageState === PageStates.FETCHING_DATA}/>
              <SavingText $visible={pageState === PageStates.SAVING}>Saving...</SavingText>
              <button
                onClick={() => insertRecipe(0)}>
                Insert Recipe
              </button>
              {
                recipeIds.map((recipeId, index) =>
                  <React.Fragment key={recipeId}>
                    <WrappedRecipeSection
                      recipeId={recipeId}
                      data={index}
                      onChange={handleRecipeStateChange}/>
                    <button
                      onClick={() => insertRecipe(index + 1)}>
                      Insert Recipe
                    </button>
                  </React.Fragment>
                )
              }
          </RecipeContainer>
        </>
      }
      </Layout>
    </>
  );
}
