import { UUID } from "crypto";
import Connection from "./connection";
import { Recipe } from "../models";

type JSON_STRING = string;

export type SqlIngredient = {
    version: number,
    raw: string,
};

export type SqlRecipe = {
    id: UUID,
    version: number,
    title: string,
    subtitle: string | null,
    author: string | null,
    ingredients: JSON_STRING,
    instructions: JSON_STRING,
};

export default class DatabaseFacade {
    private database;

    constructor(dbConnection: Connection) {
        this.database = dbConnection;
    }

    public getRecipes(): Recipe[] {
        const recipes = this.database.all<SqlRecipe>`
                select * from recipes;
            `;

        return recipes.map<Recipe>(recipe => ({
            id: recipe.id,
            version: recipe.version,
            title: recipe.title,
            subtitle: recipe.subtitle,
            author: recipe.author,
            ingredients: JSON.parse(recipe.ingredients),
            instructions: JSON.parse(recipe.instructions),
        }));
    }
}
