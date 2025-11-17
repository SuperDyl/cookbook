import { UUID } from "crypto"

export type Ingredient = {
    version: number,
    raw: string,
};

export type Recipe = {
    id: UUID,
    version: number,
    title: string,
    subtitle: string | null,
    author: string | null,
    ingredients: Ingredient[],
    instructions: string[],
};
