import type crypto = require("crypto");

export type Ingredient = {
    version: number,
    raw: string,
};

export type Recipe = {
    id: crypto.UUID,
    version: number,
    title: string,
    subtitle: string | null,
    author: string | null,
    ingredients: Ingredient[],
    instructions: string[],
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

    public async getRecipes(): Promise<Recipe[]> {
        return await this.get<Recipe[]>("recipes");
    }
}
