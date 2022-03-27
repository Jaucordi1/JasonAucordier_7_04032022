import { Tags }    from "../data/tags.js";
import { forEach } from "../utils/array.js";

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
    this.onChange  = onChange;
    this.tags      = new Tags(this.onTagsChange.bind(this));
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
   * @param {boolean} render
   */
  clear(notify = true, render = true) {
    if (render) {
      this.container.innerHTML = "";
    }
    this.tags.clear(notify);
  }
  /**
   * @param {Tag[]} tags
   * @param {boolean} notify
   * @param {boolean} render
   */
  setTags(tags, notify = true, render = true) {
    this.clear(false, render);
    this.tags.setTags(tags, notify);
    if (render) {
      this.render();
    }
  }

  render() {
    this.container.innerHTML = "";
    forEach(this.list, (tag) => this.container.appendChild(this.factory(tag)));
  }
}
