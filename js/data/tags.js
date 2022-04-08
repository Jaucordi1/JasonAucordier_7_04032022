import { replaceAccentuedChars }                       from "../utils/strings.js";
import { find, findIndex, forEach, map, some, splice } from "../utils/array.js";

// DONE
export const TagType = Object.seal(Object.freeze({
  INGREDIENT: "ingredients",
  USTENSIL: "ustensils",
  APPLIANCE: "appliance",
}));

// DONE
export class Tag {
  constructor(type, label, value) {
    this.data = Object.seal(Object.freeze({ type, label, value }));
  }

  get type() {
    return this.data.type;
  }
  get label() {
    return this.data.label;
  }
  get value() {
    return this.data.value;
  }
  get color() {
    switch (this.data.type) {
      case TagType.INGREDIENT:
      default:
        return "primary";
      case TagType.APPLIANCE:
        return "success";
      case TagType.USTENSIL:
        return "danger";
    }
  }

  /**
   * Is this tag describing given recipe ?
   * @param {IRecipe} recipe
   * @returns {boolean}
   */
  describeRecipe(recipe) {
    switch (this.type) {
      case TagType.INGREDIENT:
        return some(recipe.ingredients, ({ ingredient }) => {
          const term = replaceAccentuedChars(ingredient).toLowerCase();
          return term === this.value;
        });
      case TagType.USTENSIL:
        return some(recipe.ustensils, (ustensil) => {
          const term = replaceAccentuedChars(ustensil).toLowerCase();
          return term === this.value;
        });
      case TagType.APPLIANCE:
        const term = replaceAccentuedChars(recipe.appliance).toLowerCase();
        return term === this.value;
      default:
        console.debug("[Tag] Unknown type on describeRecipe call", this, recipe);
        return false;
    }
  }
  /**
   * @param {Tag} tag
   */
  isEqual(tag) {
    return this.type === tag.type && this.value === tag.value;
  }
}

// DONE
export class Tags {
  /**
   * @param {(tags: Tags) => void} onChange
   */
  constructor(onChange = undefined) {
    this.onChange = onChange;

    /** @type {Tag[]} */
    this._list = [];
  }
  /**
   * @return {number}
   */
  get count() {
    return this._list.length;
  }
  /**
   * @return {Tag[]}
   */
  get list() {
    return map(this._list, t => t);
  }
  notify() {
    if (this.onChange) {
      this.onChange(this);
    }
  }
  /**
   * @param {Tag} tag
   * @param {boolean} notify
   */
  add(tag, notify = true) {
    const found = find(this._list, (candidate) => candidate.isEqual(tag));
    if (!found) {
      this._list.push(tag);
      if (notify) this.notify();
    }
  }

  /**
   * @param {Tag[]} tags
   * @param {boolean} notify
   */
  addMultiple(tags, notify = true) {
    forEach(tags, (tag) => this.add(tag, false));
    if (notify) this.notify();
  }

  /**
   * @param {Tag} tag
   * @param {boolean} notify
   */
  remove(tag, notify = true) {
    const tagIdx = findIndex(this._list, (candidate) => candidate.isEqual(tag));
    if (tagIdx > -1) {
      splice(this._list, tagIdx, 1);
      if (notify) this.notify();
    }
  }

  /**
   * @param {boolean} notify
   */
  clear(notify = true) {
    this._list = [];
    if (notify) this.notify();
  }

  /**
   * @param {Tag[]} tags
   * @param {boolean} notify
   */
  setTags(tags, notify = true) {
    this.clear(false);
    this.addMultiple(tags, notify);
  }
}
