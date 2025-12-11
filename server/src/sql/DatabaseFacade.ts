import { type UUID } from "crypto";
import SqliteConnection from "./SqliteConnection.js";
import type {
    Cookbook,
    CookbookStub,
    Ingredient,
    Instruction,
    Recipe,
    RecipeStub,
    SubRecipe
} from "server-api";

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

type SqlSubRecipe = {
    id: UUID,
    version: number,
    recipeId: UUID,
    sequence: number,
    title: string | null,
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
            subRecipes: this.database.all<SqlSubRecipe>`
                    select *
                    from subRecipes
                    where recipeId = ${recipe.id}
                    order by sequence;
                `.map<SubRecipe>(sqlSubRecipe => ({
                id: sqlSubRecipe.id,
                version: sqlSubRecipe.version,
                sequence: sqlSubRecipe.sequence,
                title: sqlSubRecipe.title,
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
                })),
            }))
        };
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

            this.database.run`
                delete from subRecipes
                where recipeId = ${recipe.id};
            `;

            this.database.bulk`
                insert into subRecipes (
                    id,
                    recipeId,
                    version,
                    sequence,
                    title)
                values (
                    ${recipe.subRecipes.map(subRecipe => subRecipe.id)},
                    ${recipe.subRecipes.map(() => recipe.id)},
                    ${recipe.subRecipes.map(subRecipe => subRecipe.version)},
                    ${recipe.subRecipes.map(subRecipe => subRecipe.sequence)},
                    ${recipe.subRecipes.map(subRecipe => subRecipe.title)});
            `;

            for (const subRecipe of recipe.subRecipes) {

                this.database.run`
                    delete from ingredients
                    where subRecipeId = ${subRecipe.id};
                `;

                this.database.bulk`
                    insert into ingredients (
                        id,
                        version,
                        subRecipeId,
                        sequence,
                        raw)
                    values (
                        ${subRecipe.ingredients.map(i => i.id)},
                        ${subRecipe.ingredients.map(i => i.version)},
                        ${subRecipe.ingredients.map(() => subRecipe.id)},
                        ${subRecipe.ingredients.map(i => i.sequence)},
                        ${subRecipe.ingredients.map(i => i.raw)});
                `;

                this.database.run`
                    delete from instructions
                    where subRecipeId = ${subRecipe.id};
                `;

                this.database.bulk`
                    insert into instructions (
                        id,
                        version,
                        subRecipeId,
                        sequence,
                        raw)
                    values (
                        ${subRecipe.instructions.map(i => i.id)},
                        ${subRecipe.instructions.map(i => i.version)},
                        ${subRecipe.instructions.map(() => subRecipe.id)},
                        ${subRecipe.instructions.map(i => i.sequence)},
                        ${subRecipe.instructions.map(i => i.raw)});
                `;
            }


        })
    }
}
