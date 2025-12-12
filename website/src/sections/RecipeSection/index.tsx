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
import { useDebounce } from "@/hooks/useDebounce";

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
    },
    [setIngredients]);

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
    sequence: 0,
    title: null,
    ingredients: [],
    instructions: []
  }]);

  const titleRef = useRef<HTMLInputElement>(null);
  const authorRef = useRef<HTMLInputElement>(null);
  const urlRef = useRef<HTMLInputElement>(null);
  const subRecipesRef = useRef<(MultiFocusComponent | null)[]>([]);
  const insertSectionButtonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const api = useMemo(() => new CookbookApiV1(apiBase), []);

  const saveRecipe = useCallback(
    async ({
        title: newTitle = title,
        author: newAuthor = author,
        url: newUrl = url,
        subRecipes: newSubRecipes = subRecipes,
    }: {
      title?: string,
      author?: string,
      url?: string,
      subRecipes?: SubRecipe[],
    }) => {
      if (recipeId === null) {
        console.warn("Reached an impossible state of saving a recipe with an invalid recipeId");
        return;
      }

      setRecipeState(RecipeStates.SAVING);

      const trimmedAuthor = newAuthor.trim();
      const trimmedUrl = newUrl.trim();

      await api.postRecipe({
        id: recipeId,
        version: 0,
        title: newTitle.trim(),
        author: trimmedAuthor.length === 0 ? null:trimmedAuthor,
        url: trimmedUrl.length === 0 ? null:trimmedUrl,
        subRecipes: newSubRecipes.map(subRecipe => {

          const trimmedTitle = subRecipe.title?.trim() ?? '';

          return {
            id: subRecipe.id,
            version: subRecipe.version,
            sequence: subRecipe.sequence,
            title: trimmedTitle.length > 0 ? trimmedTitle:null,
            ingredients: subRecipe.ingredients,
            instructions: subRecipe.instructions,
          };
      }),
      });

      setRecipeState(RecipeStates.EDITING);
    },
    [api, author, subRecipes, recipeId, title, url]);

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
      const newSubRecipes = [
          ...subRecipes.slice(0, index),
          {
            ...subRecipes[index],
            ...subRecipeChange,
          },
          ...subRecipes.slice(index + 1),
        ];

      setSubRecipes(newSubRecipes);

      debouncedSaveRecipe({subRecipes: newSubRecipes});
    },
    [debouncedSaveRecipe, subRecipes]);

  const insertSubRecipe = useCallback(
    (index: number) => {
      const newSubRecipe: SubRecipe = {
        id: crypto.randomUUID() as UUID,
        version: 0,
        sequence: 0,
        title: null,
        ingredients: [],
        instructions: []
      };

      const newSubRecipes = [
          ...subRecipes.slice(0, index),
          newSubRecipe,
          ...subRecipes.slice(index),
        ];

      for(let i = 0; i < newSubRecipes.length; i++) {
        newSubRecipes[i].sequence = i;
      }

      setSubRecipes(newSubRecipes);

      debouncedSaveRecipe({subRecipes: newSubRecipes});
    },
    [debouncedSaveRecipe, subRecipes],
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
                      ref={ref => {insertSectionButtonRefs.current[index] = ref;}}
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
