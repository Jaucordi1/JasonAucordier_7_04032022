import { findIndex }     from "../utils/array.js";
import { RecipesFilter } from "../filters/recipes.js";
import { TagType }       from "../data/tags.js";

export class RecipesHelper {
  /**
   * @param {RecipesFilter} recipesFilter
   * @param {HTMLElement} container
   */
  constructor(recipesFilter, container) {
    this.filter    = recipesFilter;
    this.container = container;

    /** @type {Recipe | undefined} */
    this._focusedRecipe = undefined;
    /** @type {number | undefined} */
    this._focusedRecipeIdx = undefined;
  }

  /**
   * @returns {HTMLElement | null}
   */
  get focusedRecipeEl() {
    if (this._focusedRecipeIdx === undefined) return undefined;
    return this.container.children.item(this._focusedRecipeIdx);
  }

  /**
   * @param {Recipe} recipe
   * @returns {number}
   */
  recipeIndexFinder(recipe) {
    findIndex(this.filter.displayed, (candidate) => candidate.isEqual(recipe));
  }

  /**
   * @param {number | undefined} oldIndex
   */
  onIndexChange(oldIndex) {
    const oldFocusedRecipe = this._focusedRecipe;

    this._focusedRecipe = (this._focusedRecipeIdx !== undefined)
                          ? this.filter.displayed[this._focusedRecipeIdx]
                          : undefined;

    const elementChanged = this._focusedRecipe !== oldFocusedRecipe || this._focusedRecipeIdx !== oldIndex;
    if (elementChanged) {
      const recipeColEl = this.container.children.item(this._focusedRecipeIdx);
      if (recipeColEl) {
        const recipeEl = recipeColEl.firstElementChild;
        recipeEl.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "nearest",
        });
        recipeEl.focus();
        // TODO ? setTimeout(() => recipeEl.focus(), 250);
      }
    }
  }

  clearFocus() {
    const oldIdx = this._focusedRecipeIdx;
    this._focusedRecipeIdx = undefined;
    this.onIndexChange(oldIdx);
  }

  focusFirst() {
    const oldIdx           = this._focusedRecipeIdx;
    this._focusedRecipeIdx = 0;
    this.onIndexChange(oldIdx);
  }
  focusLast() {
    const oldIdx           = this._focusedRecipeIdx;
    this._focusedRecipeIdx = this.filter.displayed.length - 1;
    this.onIndexChange(oldIdx);
  }

  focusNext() {
    const oldIdx = this._focusedRecipeIdx;

    // Nothing focused
    if (!this._focusedRecipe) {
      // Nothing to focus
      if (this.filter.displayed.length < 1) {
        return;
      } else {
        this._focusedRecipeIdx = 0;
      } // Focus first
    } else {
      // Unfocus if last recipe
      if (this._focusedRecipeIdx === this.filter.displayed.length - 1) {
        this._focusedRecipeIdx = undefined;
      } else {
        this._focusedRecipeIdx++;
      } // Set to next idx
    }

    this.onIndexChange(oldIdx);
  }
  focusPrevious() {
    const oldIdx = this._focusedRecipeIdx;

    // No recipe focused
    if (!this._focusedRecipe) {
      // Nothing to focus
      if (this.filter.displayed.length < 1) {
        return;
      } else {
        this._focusedRecipeIdx = this.filter.displayed.length - 1;
      } // Focus last
    } else {
      // Focus last searchbox if first recipe
      if (this._focusedRecipeIdx === 0) {
        this._focusedRecipeIdx = undefined;
        Object.values(this.filter.app.searchboxes)[Object.values(TagType).length - 1].focus();
      } else {
        this._focusedRecipeIdx--;
      } // Set to previous idx
    } // A recipe is focused

    this.onIndexChange(oldIdx);
  }
}
