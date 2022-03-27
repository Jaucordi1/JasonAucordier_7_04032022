import { recipeFactory } from "../factories/card.js";
import { loadRecipes }   from "../data/loader.js";

export class RecipesHelper {
  /**
   * @param {App} app
   * @param {HTMLElement} container
   */
  constructor(app, container) {
    this.app       = app;
    this.container = container;

    /**
     * @type {IRecipe[]}
     */
    this.all = [];

    /**
     * @type {IRecipe[]}
     */
    this.displayed = [];

    /**
     * @type {boolean}
     */
    this.filtered = false;
  }

  get allIngredients() {
    return this.all.reduce((ingredients, recipe) => {
      recipe.ingredients.forEach(({ ingredient }) => ingredients.push(ingredient));
      return ingredients;
    }, []);
  }
  get allUstensils() {
    return this.all.reduce((ustensils, recipe) => {
      recipe.ustensils.forEach((ustensil) => ustensils.push(ustensil));
      return ustensils;
    }, []);
  }
  get allAppliance() {
    return this.all.map(({ appliance }) => appliance);
  }

  update() {
    console.debug("[UPDATE] RecipesHelper");
    const nbBefore    = this.displayed.length;
    const oldFiltered = this.filtered;

    this.filtered = this.app.tags.filtered || this.app.search.filtered;

    // Getting displayed recipes from last reducer in chain
    this.displayed = [...this.app.tags.reduced];

    const hasChanged = this.filtered !== oldFiltered || this.displayed.length !== nbBefore;
    if (hasChanged) this.render();
  }
  render() {
    console.debug("[RENDER] RecipesHelper");
    this.container.innerHTML = "";
    this.container.append(...this.displayed.map((recipe) => recipeFactory(recipe).getRecipeCardDOM()));
  }

  async init() {
    console.debug("[INIT] RecipesHelper");
    this.all = await loadRecipes();
  }
}
