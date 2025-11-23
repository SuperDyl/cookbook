import cors from 'cors';
import express from 'express';
import Connection from './sql/connection.js';
import DatabaseFacade from './sql/facade.js';
import { parseUUID } from './util.js';

const db = new DatabaseFacade(
    new Connection('./cookbook.sqlite'));

const app = express();
const port = 3001;

app.use(
    cors({
        origin: [
            "https://cookbook.superdyl.net",
            "http://localhost:3000",
        ]
    }));

app.get('/recipe-stubs', (request, result) => {
    result.send(db.getRecipeStubs());
});

app.get('/recipe/:id', (request, result) => {
    const recipeIdString = request.params.id;
    const recipeId = parseUUID(recipeIdString);

    if (recipeId === null) {
        result.status(400).send();
        return;
    }

    result.send(db.getRecipe(recipeId));
});

app.listen(port, () => {
    console.log(`Server started! Listening on port ${port}`);
});

