import { type UUID } from "crypto";
import type { Ingredient, Instruction, Recipe, RecipeStub } from "server-api";
import SqliteConnection from "./SqliteConnection.js";
import { Cookbook, CookbookStub } from "server-api/build/shared-types.js";

type SqlIngredient = {
    id: UUID,
    version: number,
    recipeId: UUID,
    sequence: number,
    raw: string,
};

type SqlInstruction = {
    id: UUID,
    version: number,
    recipeId: UUID,
    sequence: number,
    raw: string,
};

type SqlRecipe = {
    id: UUID,
    version: number,
    title: string,
    author: string | null,
    url: string | null,
};

type SqlCookbook = {
    id: UUID,
    version: number,
    title: string,
    author: string | null,
};

type SqlCookbookRecipe = {
    cookbookId: UUID,
    recipeId: UUID,
    sequence: number,

    version: number,
    title: string,
    author: string | null,
    url: string | null,
};

type SqlCookbookSection = {
    id: UUID,
    cookbookId: UUID,
    version: number,
    sequenceBefore: number,
    sectionName: string,
};

export default class DatabaseFacade {
    private database;

    constructor(dbConnection: SqliteConnection) {
        this.database = dbConnection;
    }

    public getCookbookStubs(): CookbookStub[] {
        const cookbooks = this.database.all<SqlCookbook>`
                select * from cookbooks;
            `;

        return cookbooks.map<CookbookStub>(sqlCookbook => ({
            id: sqlCookbook.id,
            version: sqlCookbook.version,
            title: sqlCookbook.title,
            author: sqlCookbook.author,
        }));
    }

    public getRecipeStubs(): RecipeStub[] {
        const recipes = this.database.all<SqlRecipe>`
                select * from recipes;
            `;

        return recipes.map<RecipeStub>(sqlRecipe => ({
            id: sqlRecipe.id,
            version: sqlRecipe.version,
            title: sqlRecipe.title,
            author: sqlRecipe.author,
            url: sqlRecipe.url,
        }));
    }

    public getRecipe(recipeId: UUID): Recipe | null {
        const recipe = this.database.get<SqlRecipe>`
                select *
                from recipes
                where id = ${recipeId};
            `;

        if (recipe === undefined) {
            return null;
        }

        return {
            id: recipe.id,
            version: recipe.version,
            title: recipe.title,
            author: recipe.author,
            url: recipe.url,
            ingredients: this.database.all<SqlIngredient>`
                    select *
                    from ingredients
                    where recipeId = ${recipe.id}
                    order by sequence;
                `.map<Ingredient>(sqlIngredient => ({
                    id: sqlIngredient.id,
                    version: sqlIngredient.version,
                    sequence: sqlIngredient.sequence,
                    raw: sqlIngredient.raw,
                })),
            instructions: this.database.all<SqlInstruction>`
                    select *
                    from instructions
                    where recipeId = ${recipe.id}
                    order by sequence;
                `.map<Instruction>(sqlInstruction => ({
                    id: sqlInstruction.id,
                    version: sqlInstruction.version,
                    sequence: sqlInstruction.sequence,
                    raw: sqlInstruction.raw,
                }))};
    }

    public getCookbook(cookbookId: UUID): Cookbook | null {
        const cookbook = this.database.get<SqlCookbook>`
                select *
                from cookbooks
                where id = ${cookbookId};
            `;

        if (cookbook === undefined) {
            return null;
        }

        return {
            id: cookbook.id,
            version: cookbook.version,
            title: cookbook.title,
            author: cookbook.author,
            recipes: this.database.all<UUID>`
                    select recipeId
                    from cookbookRecipes
                    where cookbookId = ${cookbook.id};`
                .map(recipeId => this.getRecipe(recipeId)) as Recipe[],
            sections: this.database.all<SqlCookbookSection>`
                select *
                from cookbookSections
                where cookbookId = ${cookbook.id};`
                .map(section => ({
                    id: section.id,
                    version: section.version,
                    sequenceBefore: section.sequenceBefore,
                    sectionName: section.sectionName,
                })),
            };
    }

    public postRecipe(recipeId: UUID, recipe: Recipe): void {
        // For simplicity, `recipe.id` is ignored and `recipeId` is used.
        // Really, I should have a separate recipe type that has all but the id.

        this.database.transaction(() => {
            this.database.run`
                replace into recipes (
                    id,
                    version,
                    title,
                    author,
                    url)
                values (
                    ${recipeId},
                    ${recipe.version},
                    ${recipe.title},
                    ${recipe.author},
                    ${recipe.url});
            `;

            this.database.bulk`
                insert into ingredients (
                    id,
                    version,
                    recipeId,
                    sequence,
                    raw)
                values (
                    ${recipe.ingredients.map(i => i.id)},
                    ${recipe.ingredients.map(i => i.version)},
                    ${recipe.ingredients.map(() => recipe.id)},
                    ${recipe.ingredients.map(i => i.sequence)},
                    ${recipe.ingredients.map(i => i.raw)});
            `;

            this.database.bulk`
                insert into instructions (
                    id,
                    version,
                    recipeId,
                    sequence,
                    raw)
                values (
                    ${recipe.instructions.map(i => i.id)},
                    ${recipe.instructions.map(i => i.version)},
                    ${recipe.instructions.map(() => recipe.id)},
                    ${recipe.instructions.map(i => i.sequence)},
                    ${recipe.instructions.map(i => i.raw)});
            `;
        })
    }
}
