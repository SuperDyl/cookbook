const axios = require("axios");

const recipes = require("./recipes.js");

const baseURL = "http://localhost:3000";

recipes.forEach(async (recipe) => {
  const response = await axios.post(`${baseURL}/api/recipes`, recipe);
  if (response.status != 200)
    console.log(`Error adding ${recipe.name}, code ${response.status}`);
});
