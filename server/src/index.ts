import express from 'express';
import DatabaseFacade from './sql/facade';
import Connection from './sql/connection';

const db = new DatabaseFacade(
    new Connection('./cookbook.sqlite'));

const app = express();
const port = 3000;

app.get('/recipes', (request, result) => {

    const recipes = db.getRecipes();

    result.send(recipes);
});

app.listen(port, () => {
    console.log(`Server started! Listening on port ${port}`);
});

