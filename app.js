const express = require("express");
const cors = require("cors");

const app = express();

const dotenv = require("dotenv");
dotenv.config();

//which port it will be hosted on during develop
const port = 10000;

//middleware to allow all ports during development
app.use(cors());

//middleware to parse json when getting a post
app.use(express.json());

////import routers here
const generateRecipesRouter = require("./routes/generateRecipes");
const generateImagesRouter = require("./routes/generateImages");
const generateNutritionRouter = require("./routes/generateNutrition");
////give the routers a path and set which router the path belongs to
app.use("/generateRecipes", generateRecipesRouter);
app.use("/generateImages", generateImagesRouter);
app.use("/generateNutrition", generateNutritionRouter);

//always set the listen at the end
app.listen(port);
