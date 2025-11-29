"use client"

import React, {
  type ChangeEvent,
  type KeyboardEvent,
  useCallback,
  useMemo,
  useRef,
  useState } from "react";
import Layout from "@/components/Layout";
import Head from "next/head";
import { Button } from "@/app/styles";
import {
  DishTitleTextInput,
  RecipeContainer,
  SubtleTextAreaInput,
  SubtleTextInput } from "./styles";
import { Ingredient, Instruction } from "server-api";
import { type UUID } from "crypto";

export default function NewRecipePage() {
  const [title, setTitle] = useState<string>("");
  const [author, setAuthor] = useState<string>("");
  const [url, setUrl] = useState<string>("");
  const [ingredients, setIngredients] = useState<Ingredient[]>([{
    id: crypto.randomUUID() as UUID,
    version: 0,
    sequence: 0,
    raw: ""
  }]);
  const [instructions, setInstructions] = useState<Instruction[]>([{
    id: crypto.randomUUID() as UUID,
    version: 0,
    sequence: 0,
    raw: ""
  }]);

  const titleRef = useRef<HTMLInputElement>(null);
  const authorRef = useRef<HTMLInputElement>(null);
  const urlRef = useRef<HTMLInputElement>(null);
  const ingredientsRef = useRef<HTMLTextAreaElement>(null);
  const instructionsRef = useRef<HTMLTextAreaElement>(null);

  const handleTitleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => setTitle(e.currentTarget.value), []);
  const handleAuthorChange = useCallback((e: ChangeEvent<HTMLInputElement>) => setAuthor(e.currentTarget.value), []);
  const handleUrlChange = useCallback((e: ChangeEvent<HTMLInputElement>) => setUrl(e.currentTarget.value), []);

  const ingredientsText = useMemo(
    () => ingredients.map((x) => x.raw).join('\n'),
    [ingredients]);

  const instructionsText = useMemo(
    () => instructions.map((x) => x.raw).join('\n'),
    [instructions]);

  const handleIngredients = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      console.log(e);

      const newRaws = e.currentTarget.value.split('\n');

      setIngredients(
        newRaws.map((raw, index) => {
          const ingredient: Ingredient = {
            id: crypto.randomUUID() as UUID,
            sequence: index,
            raw: raw,
            version: 0
          };
          return ingredient;
      }));
    },
    []);

  const handleInstructions = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      console.log(e);

      const newRaws = e.currentTarget.value.split('\n');

      setInstructions(
        newRaws.map((raw, index) => {
          const instruction: Instruction = {
            id: crypto.randomUUID() as UUID,
            sequence: index,
            raw: raw,
            version: 0
          };
          return instruction;
      }));
    },
    []);

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

  return (
    <>
      <Head>
        <title>Recipes-Cookbook</title>
      </Head>
      <Layout>
        <a href="/recipes">Go Back</a>
        <RecipeContainer>
            <DishTitleTextInput
              type="text"
              placeholder="Dish"
              value={title}
              onChange={handleTitleChange}
              onKeyDown={onTitleKeydown}
              ref={titleRef}/>
            <SubtleTextInput
              type="text"
              placeholder="Author"
              value={author}
              onChange={handleAuthorChange}
              onKeyDown={onAuthorKeydown}
              ref={authorRef}/>
            <SubtleTextInput
              type="text"
              placeholder="Url"
              value={url}
              onChange={handleUrlChange}
              onKeyDown={onUrlKeydown}
              ref={urlRef}/>
            <SubtleTextAreaInput
              placeholder="Ingredients"
              value={ingredientsText}
              onChange={e => handleIngredients(e)}
              onKeyDown={onIngredientsKeydown}
              ref={ingredientsRef}/>
            <SubtleTextAreaInput
              placeholder="Instructions"
              value={instructionsText}
              onChange={e => handleInstructions(e)}
              onKeyDown={onInstructionsKeydown}
              ref={instructionsRef}/>
            <Button>Save</Button>
        </RecipeContainer>
      </Layout>
    </>
  );
}
