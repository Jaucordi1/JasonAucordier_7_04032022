import { forEach, map, reduce } from "../utils/array.js";
import { recipeFactory }        from "../factories/card.js";
import { TagType }              from "../data/tags.js";
import { loadRecipes }          from "../data/loader.js";
import { RecipesHelper }        from "../app/recipes.js";
import { Recipe }               from "../data/recipe.js";
import { getRandomIntInRange }  from "../utils/numbers.js";

// DONE
export class RecipesFilter {
  /**
   * @param {App} app
   * @param {HTMLElement} container
   */
  constructor(app, container) {
    this.app       = app;
    this.container = container;
    this.helper    = new RecipesHelper(this, container);

    /**
     * @type {Recipe[]}
     */
    this.all = [];

    /**
     * @type {Recipe[]}
     */
    this.displayed = [];

    /**
     * @type {boolean}
     */
    this.filtered = false;
  }

  /**
   * @return {string[]}
   */
  get allIngredients() {
    return reduce(this.all, (ingredients, recipe) => {
      forEach(recipe.ingredients, ({ ingredient }) => ingredients.push(ingredient));
      return ingredients;
    }, []);
  }
  /**
   * @return {string[]}
   */
  get allUstensils() {
    return reduce(this.all, (ustensils, recipe) => {
      forEach(recipe.ustensils, (ustensil) => ustensils.push(ustensil));
      return ustensils;
    }, []);
  }
  /**
   * @return {string[]}
   */
  get allAppliance() {
    return map(this.all, ({ appliance }) => appliance);
  }
  get random() {
    const randIdx = getRandomIntInRange(0, this.all.length - 1);
    return this.all[randIdx];
  }
  clear() {
    this.container.innerHTML = "";
  }
  update() {
    const nbBefore    = this.displayed.length;
    const oldFiltered = this.filtered;

    this.filtered = this.app.tags.filtered || this.app.search.filtered;

    // Getting displayed recipes from last reducer in chain
    this.displayed = map(this.app.tags.reduced, r => r);

    const hasChanged = this.filtered !== oldFiltered || this.displayed.length !== nbBefore;
    if (hasChanged) this.render();
  }
  render() {
    this.clear();

    if (this.displayed.length === 0) {
      const ingredient1 = "« " + this.random.randomIngredient.ingredient + " »";
      const ingredient2 = "« " + this.random.randomIngredient.ingredient + " »";
      const colEl       = document.createElement("pre");
      colEl.classList.add("no-recipes");
      colEl.innerText = "Aucune recette ne correspond à votre critère…\n"
                        + "vous pouvez chercher "
                        + [ingredient1, ingredient2, "etc"].join(", ") + ".";
      this.container.append(colEl);
      return;
    }

    forEach(this.displayed, (recipe, idx) => {
      const recipeColEl = recipeFactory(recipe).getRecipeCardDOM();
      const recipeEl    = recipeColEl.firstElementChild;

      recipeEl.addEventListener("keydown", (event) => {
        if (event.code === "Tab" && !event.altKey) {
          // SHIFT+TAB
          if (event.shiftKey) {
            // For first recipe only
            if (idx === 0) {
              // Focus last searchbox
              event.preventDefault();
              this.helper.clearFocus();
              Object.values(this.app.searchboxes)[Object.values(TagType).length - 1].focus();
            } else {
              event.preventDefault();
              this.helper.focusPrevious();
            }
          } else {
            event.preventDefault();
            this.helper.focusNext();
          } // TAB
        }
      });

      this.container.append(recipeColEl);
    });
  }

  async init() {
    this.all = map(await loadRecipes(), r => new Recipe(r));
  }
}
