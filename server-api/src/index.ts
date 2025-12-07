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

type TypedArray =
    | Int8Array
    | Uint8Array
    | Uint8ClampedArray
    | Int16Array
    | Uint16Array
    | Int32Array
    | Uint32Array
    | Float16Array
    | Float64Array
    | BigInt64Array
    | BigUint64Array;

type BodyInit =
    | string
    | ArrayBuffer
    | TypedArray
    | DataView
    | Blob
    | File
    | URLSearchParams
    | FormData
    | ReadableStream;

type PostBody = BodyInit | object | null | undefined;

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

    private async post<P extends PostBody, R>(path: string, payload: P): Promise<R> {
        const requestOptions: RequestInit = {
            headers: {
                "Content-Type": "application/json",
            },
            method: "POST",
        };

        if (payload !== null && payload !== undefined) {
            switch (typeof payload) {
                case 'string':
                    requestOptions.body = payload;
                    break;
                case 'object':
                    requestOptions.body = JSON.stringify(payload);
            }
        }

        const response = await fetch(`${this.apiBase}/${path}`, requestOptions);

        if (!response.ok) {
            throw new Error(`Response failed. status=${response.status}; statusText=${response.statusText}`);
        }

        return await response.json() as R;
    }

    public async getRecipeStubs(): Promise<RecipeStub[]> {
        return await this.get<RecipeStub[]>("recipe-stubs");
    }

    public async getRecipe(recipeId: UUID): Promise<Recipe | null> {
        return await this.get<Recipe | null>(`recipe/${recipeId}`);
    }

    public async postRecipe(recipe: Recipe): Promise<void> {
        // The field `id` in `recipe` is ignored and `recipe.id` is used instead.
        // For simplicity, I left it in for this API facade to make everything simpler.
        await this.post<Recipe, null>(`recipe/${recipe.id}`, recipe);
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