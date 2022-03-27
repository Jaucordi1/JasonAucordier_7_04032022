import { replaceAccentuedChars } from "../utils.js";

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
        return recipe.ingredients.some(({ ingredient }) => {
          const term = replaceAccentuedChars(ingredient).toLowerCase();
          return term === this.value;
        });
      case TagType.USTENSIL:
        return recipe.ustensils.some((ustensil) => {
          const term = replaceAccentuedChars(ustensil).toLowerCase();
          return term === this.value;
        });
      case TagType.APPLIANCE:
        return recipe.appliance === this.value;
      default:
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
    return [...this._list];
  }

  /**
   * @param {Tag} tag
   * @param {boolean} notify
   */
  add(tag, notify = true) {
    const found = this._list.find((candidate) => candidate.type === tag.type && candidate.value === tag.value);
    if (!found) {
      this._list.push(tag);
      if (notify && this.onChange) {
        this.onChange(this);
      }
    }
  }

  /**
   * @param {Tag[]} tags
   * @param {boolean} notify
   */
  addMultiple(tags, notify = true) {
    tags.forEach((tag) => this.add(tag, false));
    if (notify) {
      this.onChange(this);
    }
  }

  /**
   * @param {Tag} tag
   * @param {boolean} notify
   */
  remove(tag, notify = true) {
    const tagIdx = this.list.findIndex((candidate) => candidate.isEqual(tag));
    if (tagIdx > -1) {
      this.list.splice(tagIdx, 1);
      if (notify && this.onChange) {
        this.onChange(this);
      }
    }
  }

  /**
   * @param {boolean} notify
   */
  clear(notify = true) {
    this._list = [];
    if (notify && this.onChange) {
      this.onChange(this);
    }
  }

  /**
   * @param {Tag[]} tags
   * @param {boolean} notify
   */
  setTags(tags, notify = true) {
    this.addMultiple(tags, notify);
  }
}
