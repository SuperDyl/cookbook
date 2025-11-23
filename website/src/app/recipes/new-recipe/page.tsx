"use client"

import React, { ChangeEvent, useCallback, useState } from "react";
import Layout from "@/components/Layout";
import Head from "next/head";
import { Button } from "@/app/styles";
import { IngredientContainer, InstructionContainer, RecipeSpace, SubtleTextInput } from "./styles";
import { Ingredient, Instruction } from "server-api";

export default function NewRecipePage() {
  const [dishTitle, setDishTitle] = useState<string>("");
  const [dishSubTitle, setDishSubtitle] = useState<string>("");
  const [dishAuthor, setDishAuthor] = useState<string>("");
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [instructions, setInstructions] = useState<Instruction[]>([]);

  const handleDishTitle = useCallback((e: ChangeEvent<HTMLInputElement>) => setDishTitle(e.currentTarget.value), []);
  const handleDishSubtitle = useCallback((e: ChangeEvent<HTMLInputElement>) => setDishSubtitle(e.currentTarget.value), []);
  const handleDishAuthor = useCallback((e: ChangeEvent<HTMLInputElement>) => setDishAuthor(e.currentTarget.value), []);

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
            <SubtleTextInput
              type="text"
              placeholder="Dish"
              value={dishTitle}
              onChange={handleDishTitle}
              style={{
                fontSize: "1.8rem",
                fieldSizing: "content",
              }}/>
            <SubtleTextInput
              type="text"
              placeholder="Subtitle"
              value={dishSubTitle}
              onChange={handleDishSubtitle}/>
            <SubtleTextInput
              type="text"
              placeholder="Author"
              value={dishAuthor} 
              onChange={handleDishAuthor}/>
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
