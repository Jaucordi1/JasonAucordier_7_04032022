import { TagFactory }        from "../factories/tags.js";
import { TagsDisplayHelper } from "../app/tags.js";

export class TagsFilter {
  /**
   * @param {App} app
   * @param {HTMLElement} container
   * @param {(tags: TagsFilter) => void} onChange
   */
  constructor(app, container, onChange) {
    this.app       = app;
    this.container = container;
    this.onChange  = onChange;

    this.tagsDisplayHelper = new TagsDisplayHelper(container, TagFactory.getTagDOM, this.update.bind(this));

    /** @type {IRecipe[]} */
    this.reduced = [];
    this.filtered = false;
  }

  /**
   * @param {Tag} tag
   */
  add(tag) {
    console.debug("Adding tag to filter");
    this.tagsDisplayHelper.add(tag);
    this.update();
  }

  /**
   * @param {Tag} tag
   */
  remove(tag) {
    console.debug("Remove tag from filter");
    this.tagsDisplayHelper.remove(tag);
    this.update();
  }

  /**
   * @param {IRecipe[]} recipes
   * @return {IRecipe[]}
   */
  reduce(recipes) {
    console.debug("[REDUCE] TagsFilter");

    if (this.tagsDisplayHelper.tags.count === 0) return [...recipes];

    const tags = this.tagsDisplayHelper.tags.list;
    return recipes.filter((recipe) => tags.some((tag) => tag.describeRecipe(recipe)));
  }

  update() {
    console.debug("[UPDATE] TagsFilter");

    const oldFiltered = this.filtered;
    const nbBefore = this.reduced.length;

    this.reduced  = this.reduce(this.app.search.reduced);
    this.filtered = this.app.search.reduced.length !== this.reduced.length;

    if (this.reduced.length !== nbBefore || this.filtered !== oldFiltered) {
      this.onChange(this);
    }
  }

  init() {
    console.debug("[INIT] TagsFilter");

    this.reduced = [...this.app.search.reduced];
  }
}
