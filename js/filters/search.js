import { replaceAccentuedChars } from "../utils/strings.js";
import { filter, map, some }     from "../utils/array.js";

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
    this.reduced  = map(app.recipes.all, r => r);
  }

  focus() {
    this.input.focus();
  }

  /**
   * @param {string} value
   */
  onKeyUp(value) {
    const newTerm = replaceAccentuedChars(value).toLowerCase();
    if (newTerm === this.term) return;

    this.term = newTerm;

    if (
      (this.filtered && this.term.length < 3)
      || (!this.filtered && this.term.length >= 3)
    ) {
      this.update();
    }
  }

  /**
   * @param {IRecipe[]} recipes
   */
  reduce(recipes) {
    if (this.term.length < 3) {
      return map(recipes, r => r);
    } else {
      return filter(recipes, (recipe) => {
        const name = replaceAccentuedChars(recipe.name.toLowerCase());
        if (name.includes(this.term)) return true;

        const description = replaceAccentuedChars(recipe.description.toLowerCase());
        if (description.includes(this.term)) return true;

        return some(recipe.ingredients, ({ ingredient }) => {
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
    const oldFiltered = this.filtered;
    const nbBefore    = this.reduced.length;

    this.filtered = this.term.length >= 3;
    this.reduced  = this.reduce(this.app.recipes.all);

    const hasChanged = this.filtered !== oldFiltered || this.reduced.length !== nbBefore;
    if (hasChanged && notify) {
      this.onChange(this);
    }
  }

  init() {
    this.reduced = this.reduce(this.app.recipes.all);
    this.input.addEventListener("keyup", (event) => this.onKeyUp(event.target.value));
  }
}
