import { UUID } from "crypto";
import Connection from "./connection.js";
import { Recipe } from "server-api";

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

        return recipes.map<Recipe>(sqlRecipe => ({
            id: sqlRecipe.id,
            version: sqlRecipe.version,
            title: sqlRecipe.title,
            subtitle: sqlRecipe.subtitle,
            author: sqlRecipe.author,
            ingredients: JSON.parse(sqlRecipe.ingredients),
            instructions: JSON.parse(sqlRecipe.instructions),
        }));
    }
}
