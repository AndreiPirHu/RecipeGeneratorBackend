const express = require("express");
const axios = require("axios");

const router = express.Router();

router.post("/", async (req, res) => {
  const getImage = async (searchQuery) => {
    try {
      const apiKey = process.env.VITE_GOOGLE_API_KEY;
      const cseID = process.env.VITE_CSE_ID;
      const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cseID}&q=${searchQuery}&searchType=image`;

      const response = await axios.get(url);

      const image = await response.data.items[0].link;
      return image;
    } catch (error) {
      console.log("Error: " + error);
      return "/src/assets/Card-placeholder.svg";
    }
  };
  ///////////starting the fetch////////////////
  console.log("getting images");
  let recipes = req.body.recipes;
  console.log(recipes);
  // create an array of promises with map
  const imagePromises = recipes.map(async (recipe) => {
    const newImage = await getImage(recipe.title);
    return newImage;
  });

  // wait for all promises to resolve
  const images = await Promise.all(imagePromises);

  //giving each recipe their img url
  recipes.forEach((recipe, index) => {
    recipe.imgURL = images[index];
  });

  //sending recipes with images
  res.json({ recipes: recipes });
});

module.exports = router;
