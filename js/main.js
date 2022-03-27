import { RecipesHelper }         from "./app/recipes.js";
import { SearchFilter }          from "./filters/search.js";
import { replaceAccentuedChars } from "./utils.js";
import { SearchboxHelper }       from "./app/searchbox.js";
import { TagsFilter }   from "./filters/tags.js";
import { Tag, TagType } from "./data/tags.js";

/**
 * App constructor
 * @class App
 */
class App {
  constructor() {
    /** @type {RecipesHelper} */
    this.recipes = new RecipesHelper(this, document.getElementById("recipes"));

    /** @type {SearchFilter} */
    this.search = new SearchFilter(this, document.querySelector("#search input"), this.onSearchChange.bind(this));

    /** @type {TagsFilter} */
    this.tags = new TagsFilter(this, document.getElementById("tags"), this.onTagsChange.bind(this));

    /**
     * @type {{
     *    [key: TagType]: SearchboxHelper
     * }}
     */
    this.searchboxes = {
      [TagType.INGREDIENT]: new SearchboxHelper(this.tags, document.getElementById("searchbox-ingredients"), TagType.INGREDIENT, (recipe) => {
        return recipe.ingredients.map(({ ingredient }) => {
          return new Tag(TagType.INGREDIENT, ingredient, replaceAccentuedChars(ingredient).toLowerCase());
        });
      }),
      [TagType.USTENSIL]: new SearchboxHelper(this.tags, document.getElementById("searchbox-ustensils"), TagType.USTENSIL, (recipe) => {
        return recipe.ustensils.map((ustensil) => {
          return new Tag(TagType.USTENSIL, ustensil, replaceAccentuedChars(ustensil).toLowerCase());
        });
      }),
      [TagType.APPLIANCE]: new SearchboxHelper(this.tags, document.getElementById("searchbox-appliance"), TagType.APPLIANCE, (recipe) => {
        return [new Tag(TagType.APPLIANCE, recipe.appliance, replaceAccentuedChars(recipe.appliance).toLowerCase())];
      }),
    };
  }

  /**
   * @param {SearchFilter} search
   */
  onSearchChange(search) {
    console.debug("[APP][CHANGE] SearchFilter", search);
    this.tags.update();
  }

  /**
   * @param {TagsFilter} filter
   */
  onTagsChange(filter) {
    console.debug("[APP][CHANGE] TagsFilter", filter);

    this.update();
  }

  update() {
    console.debug("[UPDATE] App");

    // Object.values(TagType).forEach((type) => this.searchboxes[type]);
    this.recipes.update();
  }

  init() {
    console.debug("[INIT] App");

    // Init recipes helper
    this.recipes.init()
      .then(() => {
        // Init search filter
        this.search.init();
        // Init tags filter
        this.tags.init();
        // Init searchboxes
        Object.values(TagType).forEach((type) => this.searchboxes[type].init());

        this.update();
      })
      .catch((err) => console.error("[ERROR] App :", err));
  }
}

window.app = new App();
window.app.init();
