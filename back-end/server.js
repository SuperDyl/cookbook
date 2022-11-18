const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "POST, GET, DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use(express.static("public"));

const mongoose = require("mongoose");

// connect to the database
mongoose.connect("mongodb://localhost:27017/test", {
  useUnifiedTopology: true,
  useNewUrlParser: true
});

const recipeSchema = new mongoose.Schema({
  dishName: String,
  labels: [String],
  desc: String,
  totalTime: String,
  steps: [String],
  notes: String
});

// create a virtual paramter that turns the default _id field into id
recipeSchema.virtual("id").get(function() {
  return this._id.toHexString();
});

// Ensure virtual fields are serialised when we turn this into a JSON object
recipeSchema.set("toJSON", {
  virtuals: true
});

// create a model for tickets
const Recipe = mongoose.model("Recipe", recipeSchema);

app.get("/api/recipes", async (req, res) => {
  try {
    let recipes = await Recipe.find();
    res.send({
      recipes: recipes
    });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.post("/api/recipes", async (req, res) => {
  console.log("in post");
  const recipe = new Recipe({
    dishName: req.body.dishName,
    lables: req.body.labels,
    desc: req.body.desc,
    totalTime: req.body.totalTime,
    steps: req.body.steps,
    notes: req.body.notes
  });
  try {
    await recipe.save();
    res.send({
      recipe: recipe
    });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.delete("/api/recipes/:id", async (req, res) => {
  try {
    await Recipe.deleteOne({
      _id: req.params.id
    });
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.listen(3000, () => console.log("Server listening on port 3000!"));
