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

type EditRecipesPageProps = {
  params: Promise<{
    cookbookId: string,
  }>
};

enum PageStates {
  NETWORK_ERROR = 'NETWORK_ERROR',
  COOKBOOK_ID_PARSE_ERROR = 'RECIPE_ID_PARSE_ERROR',
  EDITING = 'EDITING',
  LOADING = 'LOADING',
  SAVING = 'SAVING',
}

export default function EditCookbookPage({params}: EditRecipesPageProps) {
  const {cookbookId: cookbookIdString} = use(params);
  const cookbookId = parseUUID(cookbookIdString);

  const [pageState, setPageState] = useState<PageStates>(PageStates.LOADING);

  const [title, setTitle] = useState<string>("");
  const [author, setAuthor] = useState<string>("");
  const [recipeIds, setRecipeIds] = useState<UUID[]>([]);
  const [sections, SetSections] = useState<CookbookSection[]>([]);

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
    [setPageState]);

  const api = useMemo(() => new CookbookApiV1(apiBase), []);

  const saveCookbook = useCallback(
    async ({
        title: newTitle = title,
        author: newAuthor = author,
        recipeIds: newRecipeIds = recipeIds,
        sections: newSections = sections,
    }: {
      title?: string,
      author?: string,
      recipeIds?: UUID[],
      sections?: CookbookSection[],
    }) => {
      if (cookbookId === null) {
        console.warn("Reached an impossible state of saving a recipe with an invalid recipeId");
        return;
      }

      const trimmedTitle = newTitle.trim();
      const trimmedAuthor = newAuthor.trim();

      await api.postCookbook({
        id: cookbookId,
        version: 0,
        title: trimmedTitle,
        author: trimmedAuthor.length === 0 ? null : trimmedAuthor,
        recipeIds: newRecipeIds,
        sections: newSections,
      });
    },
    [title, author, recipeIds, sections, cookbookId, api]);

  const debouncedSaveCookbook = useDebounce(
    500,
    saveCookbook,
    handleDebounceChange,
  );

  const handleTitleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setTitle(e.currentTarget.value);
      debouncedSaveCookbook({title: e.currentTarget.value});
    },
    [debouncedSaveCookbook]);

  const handleAuthorChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setAuthor(e.currentTarget.value);
      debouncedSaveCookbook({author: e.currentTarget.value});
    }, [debouncedSaveCookbook]);

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
          console.error(e);
          setPageState(PageStates.NETWORK_ERROR);
          return;
        }

        if (cookbook !== null) {
          setTitle(cookbook.title);
          setAuthor(cookbook.author ?? '');
          setRecipeIds(cookbook.recipeIds);
          SetSections(cookbook.sections);
        }

        setPageState(PageStates.EDITING);
      }

      getCookbook();
    },
    [api, cookbookId]);

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
      {[PageStates.EDITING, PageStates.LOADING, PageStates.SAVING].includes(pageState) &&
        <>
          <RecipeContainer>
              <CookbookTitleTextInput
                type="text"
                placeholder="Cookbook Title"
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
              <SavingText $visible={pageState === PageStates.SAVING}>Saving...</SavingText>
          </RecipeContainer>
        </>
      }
      </Layout>
    </>
  );
}
