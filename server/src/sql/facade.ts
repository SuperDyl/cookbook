import { type UUID } from "crypto";
import Connection from "./connection.js";
import { type Ingredient, type Instruction, type Recipe, type RecipeStub } from "server-api";

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

export default class DatabaseFacade {
    private database;

    constructor(dbConnection: Connection) {
        this.database = dbConnection;
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
