import cors from 'cors';
import express from 'express';
import DatabaseFacade from './sql/DatabaseFacade.js';
import { parseUUID, type Recipe } from 'server-api';
import SqliteConnection from './sql/SqliteConnection.js';

const db = new DatabaseFacade(
    new SqliteConnection('./cookbook.sqlite'));

const app = express();
const port = 3001;

app.use(
    cors({
        origin: [
            "https://cookbook.superdyl.net",
            "http://localhost:3000",
        ],
    }),
    express.json(),
);

app.get('/cookbook-stubs', (request, result) => {
    result.json(db.getCookbookStubs());
});

app.get('/cookbook/:id', (request, result) => {
    const cookbookId = parseUUID(request.params.id);

    if (cookbookId === null) {
        result.status(400).send(`cookbookId must be a UUID. Received '${request.params.id}'`);
        return;
    }

    result.json(db.getCookbook(cookbookId));
});

app.get('/recipe-stubs', (request, result) => {
    result.json(db.getRecipeStubs());
});

app.get('/recipe/:id', (request, result) => {
    const recipeId = parseUUID(request.params.id);

    if (recipeId === null) {
        result.status(400).send(`recipeId must be a UUID. Received '${request.params.id}'`);
        return;
    }

    result.json(db.getRecipe(recipeId));
});

app.post('/recipe/:id', (request, result) => {
    const recipeId = parseUUID(request.params.id);

    const recipe: Recipe = request.body;

    if (recipeId === null) {
        result.status(400).send(`recipeId must be a UUID. Received '${request.params.id}'.`);
        return;
    }

    if (recipe.id !== undefined && recipe.id !== recipeId) {
        result.status(400).send(`When provided, recipe.id must match recipeId. Received recipe.id='${recipe.id}' and recipeId='${recipeId}'.`);
        return;
    }

    db.postRecipe(recipeId, recipe);

    result.sendStatus(201);
});

app.delete('/recipe/:id', (request, result) => {
    const recipeId = parseUUID(request.params.id);

    if (recipeId === null) {
        result.status(400).send(`recipeId must be a UUID. Received '${request.params.id}'.`);
        return;
    }

    result.json(db.deleteRecipe(recipeId));
});

app.listen(port, () => {
    console.log(`Server started! Listening on port ${port}`);
});

