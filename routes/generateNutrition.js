const express = require("express");
const axios = require("axios");

const router = express.Router();

const dotenv = require("dotenv");
dotenv.config();

router.post("/", async (req, res) => {
  const getNutrition = async (recipe) => {
    const appID = "e5c7f2b7";

    const appKey = process.env.VITE_NUTRITION_API_KEY;

    let url = `https://api.edamam.com/api/nutrition-details?app_id=${appID}&app_key=${appKey}`;
    let body = recipe;
    try {
      const response = await axios.post(url, body);

      const nutritionObject = {
        title: recipe.title,
        ingredientsNutrition: response.data.ingredients,
        dailyNutrientsPercent: response.data.totalDaily,
        totalNutrients: response.data.totalNutrients,
        totalKcal: response.data.totalNutrientsKCal.ENERC_KCAL,
      };
      //returns an object with the title of the recipe and all the nutritional information
      return nutritionObject;
    } catch (error) {
      console.log(error);
    }
  };

  let recipes = req.body.recipes;
  console.log(recipes);
  const recipesNutritionPromises = recipes.map(async (recipe) => {
    const newNutrition = await getNutrition(recipe);
    return newNutrition;
  });

  // wait for all promises to resolve
  const recipesNutrition = await Promise.all(recipesNutritionPromises);

  console.log(recipesNutrition);
  res.json({ nutrition: recipesNutrition });
});

module.exports = router;
