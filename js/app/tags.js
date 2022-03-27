import { Tags } from "../data/tags.js";

// DONE
export class TagsDisplayHelper {
  /**
   * @param {HTMLElement} container
   * @param {(tag: Tag) => HTMLElement} factory
   * @param {(tags: Tags) => void} onChange
   */
  constructor(container, factory, onChange) {
    this.container = container;
    this.factory   = factory;
    this.onChange = onChange;
    this.tags      = new Tags(this.onTagsChange.bind(this));
  }

  /**
   * @param {Tags} tags
   */
  onTagsChange(tags) {
    this.render();
    if (this.onChange) {
      this.onChange(this.tags);
    }
  }

  /**
   * @param {Tag} tag
   * @param {boolean} notify
   */
  add(tag, notify = true) {
    this.tags.add(tag, notify);
  }

  /**
   * @param {Tag} tag
   * @param {boolean} notify
   */
  remove(tag, notify = true) {
    this.tags.remove(tag, notify);
  }

  /**
   * @param {boolean} notify
   */
  clear(notify = true) {
    this.container.innerHTML = "";
    this.tags.clear(notify);
  }

  /**
   * @return {number}
   */
  get count() {
    return this.tags.count;
  }

  /**
   * @return {Tag[]}
   */
  get list() {
    return this.tags.list;
  }

  /**
   * @param {Tag[]} tags
   * @param {boolean} notify
   */
  setTags(tags, notify = true) {
    this.clear(false);
    this.tags.setTags(tags, notify);
    this.render();
  }

  render() {
    this.tags.list.forEach((tag) => {
      this.container.appendChild(this.factory(tag));
    });
  }
}

/**
 * TagsFilter class
 *
 * - Manage "Tags" instances
 * - Manage tags render
 */
/*export class TagsFilter {
  /!**
   * @param {App} app
   * @param {HTMLElement} container
   * @param {(tags: TagsFilter) => void} onChange
   *!/
  constructor(app, container, onChange) {
    this.app       = app;
    this.container = container;
    this.onChange  = onChange;

    /!** @type {{ [key: TagType]: Tags }} *!/
    this.tags = {};

    /!** @type {{ [key: TagType]: SearchboxHelper }} *!/
    this.helpers = {};
    this.filtered = false;

    /!** @type {IRecipe[]} *!/
    this.reduced = [];
  }

  /!**
   * @param {IRecipe[]} recipes
   * @returns {IRecipe[]}
   *!/
  reduce(recipes) {
    console.debug("[REDUCE] TagsFilter");
    if (!this.filtered) {
      return [...recipes];
    }
    return recipes.filter((recipe) => {
      const ingredients = this.helpers[TagType.INGREDIENT].tags;
      if (ingredients.length > 0) {
        const haveSome = recipe.ingredients.some((ingredient) => {
          return ingredients.includes(replaceAccentuedChars(ingredient.ingredient).toLowerCase());
        });
        if (haveSome) return true;
      }

      const ustensils = this.helpers[TagType.USTENSIL].tags;
      if (ustensils.length > 0) {
        const haveSome = recipe.ustensils.some((ustensil) => {
          return ustensils.includes(replaceAccentuedChars(ustensil).toLowerCase());
        });
        if (haveSome) return true;
      }

      const appliances = this.helpers[TagType.APPLIANCE].tags;
      if (appliances.length > 0) {
        return appliances.includes(replaceAccentuedChars(recipe.appliance).toLowerCase());
      }

      return false;
    });
  }
  update() {
    console.debug("[UPDATE] TagsFilter");
    const nbBefore    = this.reduced.length;
    const oldFiltered = this.filtered;

    this.filtered = this.tags.length > 0;
    this.reduced  = this.reduce(this.app.search.reduced);

    const hasChanged = this.filtered !== oldFiltered || this.reduced.length !== nbBefore;
    if (hasChanged) {
      this.render();
      this.onChange(this);
    }
  }

  render() {
    console.debug("[RENDER] TagsFilter");
    this.container.innerHTML = "";
    this.container.append(...this.tags.map((tag) => {
      const tagEl = this.helpers[tag.type].factory.getTagDOM(tag);

      tagEl.addEventListener("click", () => this.helpers[tag.type].remove(tagEl));

      return tagEl;
    }));
  }

  init() {
    console.debug("[INIT] TagsFilter");
    const searchboxEls = Array.from(document.querySelectorAll(".searchbox").values());
    for (const searchboxEl of searchboxEls) {
      const type = searchboxEl.id.split("-")[1];
      if (!Object.values(TagType).includes(type)) {
        continue;
      }

      const tagType         = /!** @type {TagType} *!/ type;
      const tags = new Tags();
      this.helpers[tagType] = new SearchboxHelper(searchboxEl, tagType);
    }
  }
}*/
