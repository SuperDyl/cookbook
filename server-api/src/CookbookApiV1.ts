import type { UUID } from "crypto";
import type { Cookbook, CookbookStub, Recipe, RecipeStub } from "./shared-types.js";

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

        switch (response.headers.get("Content-Type")) {
            case "application/json":
                return await response.json() as R;
            case "application/text":
                return response.text() as R;
        }

        return await response.bytes() as R;
    }

    public async getCookbookStubs(): Promise<CookbookStub[]> {
        return await this.get<CookbookStub[]>("cookbook-stubs");
    }

    public async getCookbook(cookbookId: UUID): Promise<Cookbook | null> {
        return await this.get<Cookbook | null>(`cookbook/${cookbookId}`);
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