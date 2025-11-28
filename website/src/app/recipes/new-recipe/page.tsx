"use client"

import React, {
  type ChangeEvent,
  type KeyboardEvent,
  useCallback,
  useRef,
  useState } from "react";
import Layout from "@/components/Layout";
import Head from "next/head";
import { Button } from "@/app/styles";
import {
  DishTitleTextInput,
  IngredientContainer,
  InstructionContainer,
  RecipeContainer,
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

  const ingredientsRefs = useRef<(HTMLInputElement | null)[]>([]);
  const instructionsRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleTitleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => setTitle(e.currentTarget.value), []);
  const handleAuthorChange = useCallback((e: ChangeEvent<HTMLInputElement>) => setAuthor(e.currentTarget.value), []);
  const handleUrlChange = useCallback((e: ChangeEvent<HTMLInputElement>) => setUrl(e.currentTarget.value), []);

  const handleIngredient = useCallback(
    (e: ChangeEvent<HTMLInputElement>, index: number) => {
      const newIngredients = [...ingredients];
      newIngredients[index].raw = e.currentTarget.value;
      setIngredients(newIngredients);
    },
    [ingredients]);

  const handleInstruction = useCallback(
    (e: ChangeEvent<HTMLInputElement>, index: number) => {
      const newInstructions = [...instructions];
      newInstructions[index].raw = e.currentTarget.value;
      setInstructions(newInstructions);
    },
    [instructions]);

  const allFocusableInputs = useCallback(() => {
    return [
      titleRef.current,
      authorRef.current,
      urlRef.current,
      ...ingredientsRefs.current,
      ...instructionsRefs.current,
    ].filter((ref): ref is HTMLInputElement => ref !== null);
  // TODO: Simplify this so it isn't dependent on random other objects
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ingredients, instructions]);

  const onKeydown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (!["Enter", "ArrowDown", "ArrowUp"].includes(e.key)) {
        return;
      }

      const allInputBoxes: HTMLInputElement[] = allFocusableInputs();
        const eventIndex = allInputBoxes.findIndex((item) => e.currentTarget === item);

        if (eventIndex === -1) {
          console.error(`Keydown event was for unknown item!`, e);
          return;
        }

      if (["Enter", "ArrowDown"].includes(e.key)) {
        if (eventIndex === allInputBoxes.length - 1) {
          return;
        }

        allInputBoxes[eventIndex + 1].focus();
      } else if (e.key === "ArrowUp") {
        if (eventIndex === 0) {
          return;
        }

        allInputBoxes[eventIndex - 1].focus();
      }

    },
    [allFocusableInputs]);

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
              onKeyDown={onKeydown}
              ref={titleRef}/>
            <SubtleTextInput
              type="text"
              placeholder="Author"
              value={author}
              onChange={handleAuthorChange}
              onKeyDown={onKeydown}
              ref={authorRef}/>
            <SubtleTextInput
              type="text"
              placeholder="Url"
              value={url}
              onChange={handleUrlChange}
              onKeyDown={onKeydown}
              ref={urlRef}/>
            <IngredientContainer>
              {ingredients.map(
                (ingredient, index) =>
                  <SubtleTextInput
                    type="text"
                    placeholder="Ingredients"
                    key={ingredient.id}
                    value={ingredient.raw}
                    onChange={e => handleIngredient(e, index)}
                    onKeyDown={onKeydown}
                    ref={(el: HTMLInputElement) => {ingredientsRefs.current[index] = el}}/>)}
            </IngredientContainer>
            <InstructionContainer>
              {instructions.map(
                (instruction, index) =>
                  <SubtleTextInput
                    type="text"
                    placeholder="Instructions"
                    key={instruction.id}
                    value={instruction.raw}
                    onChange={(e => handleInstruction(e, index))}
                    onKeyDown={onKeydown}
                    ref={(el: HTMLInputElement) => {instructionsRefs.current[index] = el}}/>)}
            </InstructionContainer>
            <Button>Save</Button>
        </RecipeContainer>
      </Layout>
    </>
  );
}
