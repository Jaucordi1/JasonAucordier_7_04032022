import { replaceAccentuedChars } from "../utils.js";

/**
 * DONE - Don't touch code !
 */
export class SearchFilter {
  /**
   * @param {App} app
   * @param {HTMLInputElement} input
   * @param {(search: SearchFilter) => void} onChange
   */
  constructor(app, input, onChange) {
    if (!input) {
      throw new Error("SearchHelper received \"null\" instead of an HTMLInputElement.");
    }

    this.app      = app;
    this.input    = input;
    this.onChange = onChange;
    this.term     = "";
    this.filtered = false;
    this.reduced  = [...app.recipes.all];
  }

  /**
   * @param {string} value
   */
  onInputChange(value) {
    console.debug("[CHANGE] SearchFilter");

    const newTerm = replaceAccentuedChars(value).toLowerCase();
    console.log(this.term, ">", newTerm);
    if (newTerm === this.term) return;

    this.term = newTerm;

    this.update();
  }

  /**
   * @param {IRecipe[]} recipes
   */
  reduce(recipes) {
    console.debug("[REDUCE] SearchFilter");
    if (this.term.length < 3) {
      return [...recipes];
    } else {
      return recipes.filter((recipe) => {
        const name = replaceAccentuedChars(recipe.name.toLowerCase());
        if (name.includes(this.term)) return true;

        const description = replaceAccentuedChars(recipe.description.toLowerCase());
        if (description.includes(this.term)) return true;

        return recipe.ingredients.some(({ ingredient }) => {
          const name = replaceAccentuedChars(ingredient.toLowerCase());
          return name.includes(this.term);
        });
      });
    }
  }

  /**
   * @param {boolean} notify
   */
  update(notify = true) {
    console.debug("[UPDATE] SearchFilter");

    const oldFiltered = this.filtered;
    const nbBefore    = this.reduced.length;

    this.filtered = this.term.length >= 3;
    this.reduced  = this.reduce(this.app.recipes.all);

    if (notify) {
      const hasChanged = this.filtered !== oldFiltered || this.reduced.length !== nbBefore;
      if (hasChanged) {
        this.onChange(this);
      }
    }
  }

  init() {
    console.debug("[INIT] SearchFilter");

    this.reduced = this.reduce(this.app.recipes.all);
    this.input.addEventListener("keyup", (event) => this.onInputChange(event.target.value));
  }
}
