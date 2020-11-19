function mungedRecipe(recipe) {
  return {
    title: recipe.title,
    food_api_id: recipe.id,
    image_url: recipe.image,
    ingredients: recipe.extendedIngredients.map(ingredient => {
      return ingredient.original;
    }),
    instructions: recipe.instructions,
  };
}

module.exports = { mungedRecipe };
