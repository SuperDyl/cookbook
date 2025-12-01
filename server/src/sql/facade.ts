import { UUID } from "crypto";
import Connection from "./connection.js";
import { Ingredient, Instruction, Recipe, RecipeStub } from "server-api";

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
                    where recipeId = '${recipe.id}'
                    order by sequence;
                `.map<Ingredient>(sqlIngredient => ({
                    id: sqlIngredient.id,
                    version: sqlIngredient.version,
                    sequence: sqlIngredient.sequence,
                    raw: sqlIngredient.raw,
                })),
            instructions: this.database.all<SqlInstruction>`
                    select *
                    from ingredients
                    where recipeId = '${recipe.id}'
                    order by sequence;
                `.map<Instruction>(sqlInstruction => ({
                    id: sqlInstruction.id,
                    version: sqlInstruction.version,
                    sequence: sqlInstruction.sequence,
                    raw: sqlInstruction.raw,
                }))};
    }
}
