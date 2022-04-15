import { RecipesFilter }         from "../filters/recipes.js";
import { SearchFilter }          from "../filters/search.js";
import { TagsFilter }            from "../filters/tags.js";
import { Tag, TagType }          from "../data/tags.js";
import createSearchbox           from "./searchbox.js";
import { forEach, map }          from "../utils/array.js";
import { replaceAccentuedChars } from "../utils/strings.js";

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
      [TagType.INGREDIENT]: createSearchbox({
        type: TagType.INGREDIENT,
        container: document.getElementById("searchbox-ingredients"),
        tagsFilter: this.tags,
        extractor: (recipe) => {
          return map(recipe.ingredients, ({ ingredient }) => {
            return new Tag(TagType.INGREDIENT, ingredient, replaceAccentuedChars(ingredient).toLowerCase());
          });
        },
      }),
      [TagType.APPLIANCE]: createSearchbox({
        type: TagType.APPLIANCE,
        extractor: (recipe) => {
          return [new Tag(TagType.APPLIANCE, recipe.appliance, replaceAccentuedChars(recipe.appliance).toLowerCase())];
        },
        tagsFilter: this.tags,
        container: document.getElementById("searchbox-appliance"),
      }),
      [TagType.USTENSIL]: createSearchbox({
        type: TagType.USTENSIL,
        container: document.getElementById("searchbox-ustensils"),
        extractor: (recipe) => {
          return map(recipe.ustensils, (ustensil) => {
            return new Tag(TagType.USTENSIL, ustensil, replaceAccentuedChars(ustensil).toLowerCase());
          });
        },
        tagsFilter: this.tags,
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
    console.debug("[APP][UPDATE] Searchbox helpers :", this.searchboxes);

    forEach(Object.values(TagType), (type) => this.searchboxes[type].update());
  }

  init() {
    console.debug("[INIT] App");

    // Init recipes helper
    this.recipes.init()
      .then(() => {
        console.info("[App]", "Loaded", this.recipes.all.length, "recipes.");

        console.time("App init");
        // Init search filter
        this.search.init();
        // Init tags filter
        this.tags.init();
        // Init searchboxes
        Object.values(TagType).forEach((type) => this.searchboxes[type].init());

        console.timeEnd("App init");

        this.recipes.update();

        console.debug("[App] Available.");
      })
      .catch((err) => console.error("[ERROR] App :", err));
  }
}

export default App;
