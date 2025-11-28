import {type UUID} from "crypto";

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

export class CookbookApiV1 {
    public apiBase: string;

    constructor(apiBase: string) {
        this.apiBase = apiBase;
    }

    private async get<T>(path: string): Promise<T> {
        const response = await fetch(`${this.apiBase}/${path}`);

        if (!response.ok) {
            throw new Error(`Response failed. status=${response.status}; statusText=${response.statusText}`);
        }

        return await response.json() as T;
    }

    public async getRecipeStubs(): Promise<RecipeStub[]> {
        return await this.get<RecipeStub[]>("recipe-stubs");
    }

    public async getRecipes(recipeId: UUID): Promise<Recipe[]> {
        return await this.get<Recipe[]>(`recipe/${recipeId}`);
    }
}
