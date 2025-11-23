"use client"

import React, { ChangeEvent, useCallback, useState } from "react";
import Layout from "@/components/Layout";
import Head from "next/head";
import { Button } from "@/app/styles";
import {
  DishTitleTextInput,
  IngredientContainer,
  InstructionContainer,
  RecipeSpace,
  SubtleTextInput } from "./styles";
import { Ingredient, Instruction } from "server-api";

export default function NewRecipePage() {
  const [title, setTitle] = useState<string>("");
  const [subTitle, setSubtitle] = useState<string>("");
  const [author, setAuthor] = useState<string>("");
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [instructions, setInstructions] = useState<Instruction[]>([]);

  const handleTitle = useCallback((e: ChangeEvent<HTMLInputElement>) => setTitle(e.currentTarget.value), []);
  const handleSubtitle = useCallback((e: ChangeEvent<HTMLInputElement>) => setSubtitle(e.currentTarget.value), []);
  const handleAuthor = useCallback((e: ChangeEvent<HTMLInputElement>) => setAuthor(e.currentTarget.value), []);

  const handleIngredient = useCallback(
    (e: ChangeEvent<HTMLInputElement>, index: number) => {
      setIngredients((prevIngredients => {
        const newIngredients = [...prevIngredients];
        newIngredients[index].raw = e.currentTarget.value;
        return newIngredients;
      }));
    },
    []);

  const handleInstruction = useCallback(
    (e: ChangeEvent<HTMLInputElement>, index: number) => {
      setInstructions((prevInstructions => {
        const newInstructions = [...prevInstructions];
        newInstructions[index].raw = e.currentTarget.value;
        return newInstructions;
      }));
    },
    []);

  return (
    <>
      <Head>
        <title>Recipes-Cookbook</title>
      </Head>
      <Layout>
        <a href="/recipes">Go Back</a>
        <RecipeSpace>
            <DishTitleTextInput
              type="text"
              placeholder="Dish"
              value={title}
              onChange={handleTitle}/>
            <SubtleTextInput
              type="text"
              placeholder="Subtitle"
              value={subTitle}
              onChange={handleSubtitle}/>
            <SubtleTextInput
              type="text"
              placeholder="Author"
              value={author}
              onChange={handleAuthor}/>
            <IngredientContainer>
              {ingredients.map(
                (ingredient, index) =>
                  <SubtleTextInput
                    type="text"
                    placeholder="Ingredients"
                    key={ingredient.id}
                    value={ingredient.raw}
                    onChange={e => handleIngredient(e, index)}/>)}
              <SubtleTextInput type="text" placeholder="Ingredients"/>
            </IngredientContainer>
            <InstructionContainer>
              {instructions.map(
                (instruction, index) =>
                  <SubtleTextInput
                    type="text"
                    placeholder="Instructions"
                    key={instruction.id}
                    value={instruction.raw}
                    onChange={(e => handleInstruction(e, index))}/>)}
              <SubtleTextInput type="text" placeholder="Instructions"/>
            </InstructionContainer>
            <Button>Save</Button>
        </RecipeSpace>
      </Layout>
    </>
  );
}
