import { TagFactory }        from "../factories/tags.js";
import { TagsDisplayHelper }        from "../app/tags.js";
import { every, filter, map } from "../utils/array.js";

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

    this.tagsDisplayHelper = new TagsDisplayHelper(container, this.tagFactory.bind(this), this.update.bind(this));

    /** @type {IRecipe[]} */
    this.reduced = [];
    this.filtered = false;
  }

  /**
   * @param {Tag} tag
   * @return {HTMLButtonElement}
   */
  tagFactory(tag) {
    const tagEl = TagFactory.getTagDOM(tag);
    tagEl.addEventListener("click", () => this.remove(tag));
    return tagEl;
  }

  /**
   * @param {Tag} tag
   */
  add(tag) {
    this.tagsDisplayHelper.add(tag);
  }

  /**
   * @param {Tag} tag
   */
  remove(tag) {
    this.tagsDisplayHelper.remove(tag);
  }

  /**
   * @param {IRecipe[]} recipes
   * @return {IRecipe[]}
   */
  reduce(recipes) {
    if (this.tagsDisplayHelper.tags.count === 0) return map(recipes, r => r);

    const tags = this.tagsDisplayHelper.tags.list;
    // Using "every" here to only keep recipes that matches "ALL" active tags
    // If you want to keep recipes that matches "AT LEAST 1" active tag, use "some" instead.
    return filter(recipes, (recipe) => every(tags, (tag) => tag.describeRecipe(recipe)));
  }

  update() {
    const oldFiltered = this.filtered;
    const nbBefore    = this.reduced.length;

    console.time("Tags filter");
    this.reduced  = this.reduce(this.app.search.reduced);
    console.timeEnd("Tags filter");
    this.filtered = this.app.search.reduced.length !== this.reduced.length;

    if (this.reduced.length !== nbBefore || this.filtered !== oldFiltered) {
      this.onChange(this);
    }
  }

  init() {
    this.reduced = map(this.app.search.reduced, r => r);
  }
}
