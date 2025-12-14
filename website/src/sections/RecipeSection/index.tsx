"use client"

import React, {
  type ChangeEvent,
  type KeyboardEvent,
  Ref,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState } from "react";
import {
  DishTitleTextInput,
  RecipeContainer,
  SavingText,
  SubRecipeContainer,
  SubtleTextAreaInput,
  SubtleTextInput } from "./styles";
import {
  CookbookApiV1,
  type Ingredient,
  type Instruction,
  type Recipe,
  type SubRecipe} from "server-api";
import { type UUID } from "crypto";
import Link from "next/link";
import { apiBase } from "@/constants";
import { DebounceStates, useDebounce } from "@/hooks/useDebounce";

type MultiFocusComponent = {
  focusStart: () => void,
  focusEnd: () => void,
};

type SubRecipeSectionProps = {
    title: string,
    ingredients: Ingredient[],
    instructions: Instruction[],

    setTitle: (title: string) => void,
    setIngredients: (ingredients: Ingredient[]) => void,
    setInstructions: (instructions: Instruction[]) => void,

    ref?: Ref<MultiFocusComponent>,
    className?: string,
    onKeyDown?: (keyboardEvent: KeyboardEvent) => void,
};

function SubRecipeSection({
  title,
  ingredients,
  instructions,
  setTitle,
  setIngredients,
  setInstructions,
  ref,
  className,
  onKeyDown = () => {},
}: SubRecipeSectionProps) {
  const titleRef = useRef<HTMLInputElement>(null);
  const ingredientsRef = useRef<HTMLTextAreaElement>(null);
  const instructionsRef = useRef<HTMLTextAreaElement>(null);

  const focusStart = useCallback(
    () => titleRef.current?.focus(),
    []);

  const focusEnd = useCallback(
    () => instructionsRef.current?.focus(),
    []);

  useImperativeHandle(
    ref,
    () => ({
      focusStart,
      focusEnd,
    }),
    [focusStart, focusEnd]);

  const handleTitleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setTitle(e.currentTarget.value);
    },
    [setTitle]);

  const ingredientsText = useMemo(
    () => ingredients.map((x) => x.raw).join('\n'),
    [ingredients]);

  const instructionsText = useMemo(
    () => instructions.map((x) => x.raw).join('\n'),
    [instructions]);

  const handleIngredients = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      const newRaws = e.currentTarget.value.split('\n');
      const newIngredients: Ingredient[] = newRaws.map(raw => {
          const ingredient: Ingredient = {
            id: crypto.randomUUID() as UUID,
            raw: raw,
            version: 0,
          };
          return ingredient;
      })

      setIngredients(newIngredients);
    },
    [setIngredients]);

  const handleInstructions = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      const newRaws = e.currentTarget.value.split('\n');
      const newInstructions: Instruction[] = newRaws.map(raw => {
          const instruction: Instruction = {
            id: crypto.randomUUID() as UUID,
            raw: raw,
            version: 0,
          };
          return instruction;
      })

      setInstructions(newInstructions);
    },
    [setInstructions]);

  const onTitleKeydown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (["Enter", "ArrowDown"].includes(e.key)) {
        e.preventDefault();
        e.stopPropagation();
        ingredientsRef?.current?.focus();
      }
    },
    []);

  const onIngredientsKeydown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "ArrowUp") {
        e.stopPropagation();
        if (e.currentTarget.selectionStart === 0) {
          titleRef?.current?.focus();
        }
      } else if (e.key === "ArrowDown") {
        e.stopPropagation();
        if (e.currentTarget.selectionStart === e.currentTarget.value.length) {
          instructionsRef?.current?.focus();
        }
      }
    },
    []);

  const onInstructionsKeydown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "ArrowUp") {
        e.stopPropagation();
        if (e.currentTarget.selectionStart === 0) {
          ingredientsRef?.current?.focus();
        }
      }
    },
    []);

  return (
    <SubRecipeContainer
      className={className}
      onKeyDown={onKeyDown}>
      <SubtleTextInput
        type="text"
        placeholder="Recipe Section Title"
        value={title}
        onChange={handleTitleChange}
        onKeyDown={onTitleKeydown}
        ref={titleRef}/>
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
    </SubRecipeContainer>
  );
}

/**
 * This lists all possible states for the section to be in.
 * It should be considered a state machine,
 * where displayed page content and available actions depend
 * on the current state.
 *
 * Currently:
 *
 * PageLoad -> FETCHING_DATA, NETWORK_FETCH_ERROR
 *
 * FETCHING_DATA -> VIEWING -> EDITING
 *
 * EDITING -> SAVING & VIEWING
 *
 * SAVING -> EDITING
 */
enum RecipeStates {
  FETCHING_DATA = 'FETCHING_DATA',
  VIEWING = 'VIEWING',
  EDITING = 'EDITING',
  SAVING = 'SAVING',
  NETWORK_FETCH_ERROR = 'NETWORK_FETCH_ERROR',
}

type RecipeSectionProps = {
    recipeId: UUID,
};

export default function RecipeSection({recipeId}: RecipeSectionProps) {
  const [recipeState, setRecipeState] = useState<RecipeStates>(RecipeStates.FETCHING_DATA);

  const [title, setTitle] = useState<string>("");
  const [author, setAuthor] = useState<string>("");
  const [url, setUrl] = useState<string>("");
  const [subRecipes, setSubRecipes] = useState<SubRecipe[]>([{
    id: crypto.randomUUID() as UUID,
    version: 0,
    title: null,
    ingredients: [],
    instructions: []
  }]);

  const titleRef = useRef<HTMLInputElement>(null);
  const authorRef = useRef<HTMLInputElement>(null);
  const urlRef = useRef<HTMLInputElement>(null);
  const subRecipesRef = useRef<(MultiFocusComponent | null)[]>([]);

  const handleDebounceChange = useCallback(
    (newState: DebounceStates) => {
      console.log(newState);
      if (newState === DebounceStates.WAITING) {
        setRecipeState(RecipeStates.EDITING);
      } else if (newState !== DebounceStates.CANCELED) {
        setRecipeState(RecipeStates.SAVING);
      }
    },
    []);

  const api = useMemo(() => new CookbookApiV1(apiBase), []);

  /**
   * Cleans up and posts the cleaned up data. This call should be debounced.
   *
   * Data outside of this function is made for the UI
   * and isn't cleaned up like it would be in the database.
   * It could be cleaned with certain events (i.e. onBlur of fields or with a button)
   * but cleaning data while being input into form elements would make many edits painful.
   *
   * While the UI must have "dirty" data,
   * the database doesn't have the same restriction (for the most part).
   *
   * I determined some invalid states for data:
   * 1. All strings should be trimmed
   * 2. Empty strings are invalid fields and should be made null. Recipe titles are the exception.
   * 3. A subRecipe with no data is invalid UNLESS it is the only subRecipe
   * 4. All recipes have at least one subRecipe, even if that subRecipe is blank.
   */
  const saveRecipe = useCallback(
    async ({
        title: newTitle,
        author: newAuthor,
        url: newUrl,
        subRecipes: newSubRecipes,
    }: {
      title: string,
      author: string,
      url: string,
      subRecipes: SubRecipe[],
    }) => {
      if (recipeId === null) {
        console.warn("Reached an impossible state of saving a recipe with an invalid recipeId");
        return;
      }

      const trimmedTitle = newTitle.trim();
      const trimmedAuthor = newAuthor.trim();
      const trimmedUrl = newUrl.trim();

      const cleanSubRecipes = newSubRecipes.map(subRecipe => {

          const trimmedTitle = subRecipe.title?.trim() ?? '';

          const cleanIngredients = subRecipe.ingredients.map(ingredient => {
              const newIngredient: Ingredient = {
                id: ingredient.id,
                version: ingredient.version,
                raw: ingredient.raw.trim(),
              };
              return newIngredient;
            }).filter(ingredient => ingredient.raw.length > 0);

          const cleanInstructions = subRecipe.instructions.map(instruction => {
              const newInstruction: Instruction = {
                id: instruction.id,
                version: instruction.version,
                raw: instruction.raw.trim(),
              };
              return newInstruction;
            }).filter(instruction => instruction.raw.length > 0);

          return {
            id: subRecipe.id,
            version: subRecipe.version,
            title: trimmedTitle.length > 0 ? trimmedTitle:null,
            ingredients: cleanIngredients,
            instructions: cleanInstructions,
          };
        }).filter(subRecipe => !(
          subRecipe.title === null
          && subRecipe.ingredients.length === 0
          && subRecipe.instructions.length === 0
        ));

      if (cleanSubRecipes.length === 0) {
        if (trimmedTitle.length === 0
          && trimmedAuthor.length === 0
          && trimmedUrl.length === 0) {

            await api.deleteRecipe(recipeId);
            return;
        } else {
          cleanSubRecipes.push({
            id: crypto.randomUUID() as UUID,
            version: 0,
            title: null,
            ingredients: [],
            instructions: []
          });
        }
      }

      await api.postRecipe({
        id: recipeId,
        version: 0,
        title: trimmedTitle,
        author: trimmedAuthor.length === 0 ? null:trimmedAuthor,
        url: trimmedUrl.length === 0 ? null:trimmedUrl,
        subRecipes: cleanSubRecipes,
      });
    },
    [api, recipeId]);

  const debouncedSaveRecipe = useDebounce(
    500,
    saveRecipe,
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

  const handleUrlChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setUrl(e.currentTarget.value);
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
      } else if (["Enter", "ArrowDown"].includes(e.key)) {
        e.preventDefault();
        urlRef?.current?.focus();
      }
    },
    []);

  const onUrlKeydown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (["ArrowUp"].includes(e.key)) {
        e.preventDefault();
        authorRef?.current?.focus();
      } else if (["Enter", "ArrowDown"].includes(e.key)
          && subRecipesRef.current.length > 0
          && subRecipesRef.current[0] !== null) {
        e.preventDefault();
        subRecipesRef.current[0].focusStart();
      }
    },
    []);

  const onSubRecipeKeydown = useCallback(
    (index: number, e: KeyboardEvent) => {
      if (e.key === "ArrowUp") {
        e.preventDefault();
        if (index === 0) {
          urlRef.current?.focus();
        } else {
          subRecipesRef.current[index - 1]?.focusEnd();
        }
      } else if (e.key === "ArrowDown") {
        if (index < subRecipesRef.current.length - 1) {
          e.preventDefault();
          subRecipesRef.current[index + 1]?.focusStart();
        }
      }
    },
    []);

  const updateSubRecipe = useCallback(
    (
      index: number,
      subRecipeChange: {
        title?: string,
        ingredients?: Ingredient[],
        instructions?: Instruction[],
      },
    ) => {
      setSubRecipes(oldSubRecipes => {
        const newSubRecipes: SubRecipe[] = [
          ...oldSubRecipes.slice(0, index),
          {
            ...oldSubRecipes[index],
            ...subRecipeChange,
          },
          ...oldSubRecipes.slice(index + 1),
        ];

        return newSubRecipes;
      });
    },
    []);

  const insertSubRecipe = useCallback(
    (index: number) => {
      setSubRecipes(oldSubRecipes => {
        const newSubRecipe: SubRecipe = {
          id: crypto.randomUUID() as UUID,
          version: 0,
          title: null,
          ingredients: [{
            id: crypto.randomUUID() as UUID,
            version: 0,
            raw: ""
          }],
          instructions: [{
            id: crypto.randomUUID() as UUID,
            version: 0,
            raw: ""
          }],
        };

        const newSubRecipes: SubRecipe[] = [
            ...oldSubRecipes.slice(0, index),
            newSubRecipe,
            ...oldSubRecipes.slice(index),
          ];

        return newSubRecipes;
      });
    },
    [],
  )

  useEffect(
    () => {
      async function getRecipe() {
        let recipe: Recipe | null;
        try {
          recipe = await api.getRecipe(recipeId);
        } catch (e: unknown) {
          console.error(e);
          setRecipeState(RecipeStates.NETWORK_FETCH_ERROR);
          return;
        }

        if (recipe !== null) {
          setTitle(recipe.title);
          setAuthor(recipe.author ?? '');
          setUrl(recipe.url ?? '');
          setSubRecipes(recipe.subRecipes);
        }

        setRecipeState(RecipeStates.EDITING);
      }

      getRecipe();
    },
    [api, recipeId]);

  useEffect(
    () => {
      debouncedSaveRecipe({
        title,
        author,
        url,
        subRecipes,
      });
    },
    [author, debouncedSaveRecipe, subRecipes, title, url],
  )

  const preventPageUnload = useCallback(
    (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = true;
    },
    []);

  useEffect(
    () => {
      if (recipeState === RecipeStates.SAVING) {
        window.addEventListener('beforeunload', preventPageUnload);
        return () => window.removeEventListener('beforeunload', preventPageUnload);
      }
    },
    [preventPageUnload, recipeState]);

  return (
    <>
      {recipeState === RecipeStates.NETWORK_FETCH_ERROR &&
        <>
          <p>Encountered a networking error!</p>
          <Link href='/recipe/new'>Create New Recipe</Link>
        </>
      }
      {recipeState === RecipeStates.FETCHING_DATA && <p>Fetching</p>}
      {[RecipeStates.EDITING, RecipeStates.SAVING].includes(recipeState) &&
        <>
          <RecipeContainer>
              <DishTitleTextInput
                type="text"
                placeholder={recipeState === RecipeStates.FETCHING_DATA ? "":"Dish"}
                value={title}
                onChange={handleTitleChange}
                onKeyDown={onTitleKeydown}
                ref={titleRef}/>
              <SubtleTextInput
                type="text"
                placeholder={recipeState === RecipeStates.FETCHING_DATA ? "":"Author"}
                value={author}
                onChange={handleAuthorChange}
                onKeyDown={onAuthorKeydown}
                ref={authorRef}/>
              <SubtleTextInput
                type="text"
                placeholder={recipeState === RecipeStates.FETCHING_DATA ? "":"Url"}
                value={url}
                onChange={handleUrlChange}
                onKeyDown={onUrlKeydown}
                ref={urlRef}/>
              <button
                onClick={() => insertSubRecipe(0)}>
                  Insert Recipe Section
              </button>
              {
                subRecipes.map((subRecipe, index) => (
                  <React.Fragment key={subRecipe.id}>
                    <SubRecipeSection
                      title={subRecipe.title ?? ''}
                      ingredients={subRecipe.ingredients}
                      instructions={subRecipe.instructions}
                      setTitle={(newTitle: string) => updateSubRecipe(index, {title: newTitle})}
                      setIngredients={(newIngredients: Ingredient[]) => updateSubRecipe(index, {ingredients: [...newIngredients]})}
                      setInstructions={(newInstructions: Instruction[]) => updateSubRecipe(index, {instructions: [...newInstructions]})}
                      onKeyDown={e => onSubRecipeKeydown(index, e)}
                      ref={ref => {subRecipesRef.current[index] = ref;}}/>
                    <button
                      onClick={() => insertSubRecipe(index + 1)}>
                        Insert Recipe Section
                    </button>
                  </React.Fragment>))
              }
              <SavingText $visible={recipeState === RecipeStates.SAVING}>Saving...</SavingText>
          </RecipeContainer>
        </>
      }
    </>
  );
}
