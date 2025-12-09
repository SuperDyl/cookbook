import type { UUID } from "crypto";

export type Ingredient = {
    id: UUID,
    version: number,
    sequence: number,
    raw: string,
};

export type Instruction = {
    id: UUID,
    version: number,
    sequence: number,
    raw: string,
};

export type RecipeStub = {
    id: UUID,
    version: number,
    title: string,
    author: string | null,
    url: string | null,
};

export type Recipe = RecipeStub & {
    ingredients: Ingredient[],
    instructions: Instruction[],
};

export type CookbookSection = {
    id: UUID,
    version: number,
    sequenceBefore: number,
    sectionName: string,
};

export type CookbookStub = {
    id: UUID,
    version: number,
    title: string,
    author: string | null,
};

export type Cookbook = CookbookStub & {
    recipes: Recipe[],
    sections: CookbookSection[],
};
