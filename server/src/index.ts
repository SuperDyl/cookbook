import cors from 'cors';
import express from 'express';
import Connection from './sql/connection.js';
import DatabaseFacade from './sql/facade.js';

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

app.get('/recipes', (request, result) => {

    const recipes = db.getRecipes();

    result.send(recipes);
});

app.listen(port, () => {
    console.log(`Server started! Listening on port ${port}`);
});

