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

    public async getRecipe(recipeId: UUID): Promise<Recipe | null> {
        return await this.get<Recipe | null>(`recipe/${recipeId}`);
    }
}

export function parseUUID(text: string): UUID | null {
    const stripped = text.replaceAll(/[-\s]/g, '').toLowerCase();

    if (!stripped.match(/[0-9a-f]{32}/g)) {
        return null;
    }

    return [
        stripped.substring(0, 8),
        stripped.substring(8, 12),
        stripped.substring(12, 16),
        stripped.substring(16, 20),
        stripped.substring(20)
    ].join('-') as UUID;
}