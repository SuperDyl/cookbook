import cors from 'cors';
import express from 'express';
import Connection from './sql/connection.js';
import DatabaseFacade from './sql/facade.js';
import { parseUUID, type Recipe } from 'server-api';

const db = new DatabaseFacade(
    new Connection('./cookbook.sqlite'));

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
    const recipe: Recipe = request.body.json();

    if (recipeId === null) {
        result.status(400).send(`recipeId must be a UUID. Received '${request.params.id}'.`);
        return;
    }

    if (recipe.id !== undefined && recipe.id !== recipeId) {
        result.status(400).send(`When provided, recipe.id must match recipeId. Received recipe.id='${recipe.id}' and recipeId='${recipeId}'.`);
        return;
    }

    db.postRecipe(recipeId, recipe);
});

app.listen(port, () => {
    console.log(`Server started! Listening on port ${port}`);
});

