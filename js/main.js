import { SearchFilter }          from "./filters/search.js";
import { replaceAccentuedChars } from "./utils.js";
import { SearchboxHelper }       from "./app/searchbox.js";
import { TagsFilter }            from "./filters/tags.js";
import { Tag, TagType }          from "./data/tags.js";
import { forEach, map }          from "./utils/array.js";
import { RecipesFilter }         from "./filters/recipes.js";

/**
 * App constructor
 * @class App
 */
class App {
  constructor() {
    /** @type {RecipesFilter} */
    this.recipes = new RecipesFilter(this, document.getElementById("recipes"));

    /** @type {SearchFilter} */
    this.search = new SearchFilter(this, document.querySelector("#search input"), this.onSearchChange.bind(this));

    /** @type {TagsFilter} */
    this.tags = new TagsFilter(this, document.getElementById("tags"), this.onTagsChange.bind(this));

    /** @type {{ [key: TagType]: SearchboxHelper }} */
    this.searchboxes = {
      [TagType.INGREDIENT]: new SearchboxHelper(this.tags, document.getElementById("searchbox-ingredients"), TagType.INGREDIENT, (recipe) => {
        return map(recipe.ingredients, ({ ingredient }) => {
          return new Tag(TagType.INGREDIENT, ingredient, replaceAccentuedChars(ingredient).toLowerCase());
        });
      }),
      [TagType.APPLIANCE]: new SearchboxHelper(this.tags, document.getElementById("searchbox-appliance"), TagType.APPLIANCE, (recipe) => {
        return [new Tag(TagType.APPLIANCE, recipe.appliance, replaceAccentuedChars(recipe.appliance).toLowerCase())];
      }),
      [TagType.USTENSIL]: new SearchboxHelper(this.tags, document.getElementById("searchbox-ustensils"), TagType.USTENSIL, (recipe) => {
        return map(recipe.ustensils, (ustensil) => {
          return new Tag(TagType.USTENSIL, ustensil, replaceAccentuedChars(ustensil).toLowerCase());
        });
      }),
    };
  }

  /**
   * @param {SearchFilter} filter
   */
  onSearchChange(filter) {
    console.debug("[APP][CHANGE] Search filter :", filter.reduced.length, "recipes");

    this.tags.update();
  }

  /**
   * @param {TagsFilter} filter
   */
  onTagsChange(filter) {
    console.debug("[APP][CHANGE] Tags filter :", filter.reduced.length, "recipes");

    this.updateSearchboxes();
    this.recipes.update();
  }

  updateSearchboxes() {
    console.debug("[APP][UPDATE] Searchbox helpers…");
    forEach(Object.values(TagType), (type) => this.searchboxes[type].update());
  }

  init() {
    console.debug("[INIT] App");

    // Init recipes helper
    this.recipes.init()
      .then(() => {
        console.info("[App]", "Loaded", this.recipes.all.length, "recipes.");

        // Init search filter
        this.search.init();
        // Init tags filter
        this.tags.init();
        // Init searchboxes
        Object.values(TagType).forEach((type) => this.searchboxes[type].init());

        this.recipes.update();

        console.info("[App] Available.");
      })
      .catch((err) => console.error("[ERROR] App :", err));
  }
}

window.app = new App();
window.app.init();
