/**
 * Load recipes from recipes.js
 * @return {Promise<IRecipe[]>}
 */
export async function loadRecipes() {
  return (await import("./recipes.js")).default;
}
