//// A router for a different function to keep them all separate
const OpenAI = require("openai");
const express = require("express");

const dotenv = require("dotenv");
dotenv.config();

const router = express.Router();

//the route will always be the one specified in server.js. In this instance, /generateRecipes
//anything writte after the "/" here will be an additional path after /generateRecipes/

router.post("/", async (req, res) => {
  //template for the AI to know the format i want to receive

  let jsonRecipeTemplate = {
    title: "Creamy Korean Potato and Quorn Stir-Fry",
    cuisine: "Korean",
    ingredients: [
      "2 large, diced potatoes",
      "1/2 cup cream",
      "1 , sliced red bell pepper",
      "2 tbsp butter",
      "2 tbsp oil",
      "1 medium, thinly sliced cucumber",
      "1 cup, diced quorn",
      "2 cups, cooked rice",
      "1 medium, diced sweet potato",
    ],
    instructions: [
      "In a large skillet, heat the oil and butter over medium heat.",
      "Add the diced potatoes and sweet potatoes to the skillet and cook until golden brown, about 10 minutes.",
      "Add the bell peppers and quorn to the skillet and sauté for another 5 minutes.",
      "Pour in the cream and stir to combine, then reduce heat to low and let simmer for 5 minutes.",
      "Serve the creamy potato and quorn stir-fry over the cooked rice and garnish with sliced cucumber.",
    ],
  };

  const apiKey = process.env.VITE_OPENAI_API_KEY;

  //message for ai from frontend
  let userPreferencesMessage = req.body.message;

  console.log("Asking gpt");

  const openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });

  try {
    ///////////////////fetch till openai///////////////
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are recipe generator that generates a JSON with 3 recipes based on the ingredients that the user gives you. The recipes can only include these ingredients and nothing else and you must follow preferences like the preferred cuisine.",
        },
        {
          role: "user",
          content: userPreferencesMessage,
        },
        {
          role: "assistant",
          content: `Make each recipe follow the same structure as this ${JSON.stringify(
            jsonRecipeTemplate
          )}. Always write the quantity needed of each ingredient. `,
        },
      ],
      model: "gpt-3.5-turbo-1106",
      response_format: { type: "json_object" },
    });
    res.json({ recipes: completion.choices[0].message.content });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
