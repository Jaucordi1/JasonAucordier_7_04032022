import { TagsDisplayHelper }                                         from "./tags.js";
import { replaceAccentuedChars }                                     from "../utils/strings.js";
import { filter, find, findIndex, forEach, includes, reduce, split } from "../utils/array.js";
import { TagType }                                                   from "../data/tags.js";

class SearchboxHelper {
  /**
   * @param {TagsFilter} tagsFilter
   * @param {HTMLElement} container
   * @param {TagType} type
   * @param {(recipe: IRecipe) => Tag[]} extractor
   */
  constructor(tagsFilter, container, type, extractor) {
    this.tagsFilter = tagsFilter;
    this.container  = container;
    this.input      = this.container.querySelector(".form-control");
    this.button     = this.container.querySelector(".dropdown-toggle");
    this.menu       = this.container.querySelector(".dropdown-menu");
    this.type       = type;
    this.extractor  = extractor;

    /** @type {TagsDisplayHelper} */
    this.tags = new TagsDisplayHelper(this.menu, this.itemFactory.bind(this), this.onTagsChange.bind(this));

    this.search         = "";
    this.opened         = false;
    this.cancelNextHide = false;
  }

  /**
   * @param {Tags} tags
   */
  onTagsChange(tags) {
    this.update();
  }

  /**
   * @param {Tag} tag
   * @return {HTMLLIElement}
   */
  itemFactory(tag) {
    const item = document.createElement("li");
    item.classList.add("dropdown-item");
    item.textContent = tag.label;

    item.addEventListener("click", (event) => {
      event.preventDefault();
      this.cancelNextHide = this.opened;
      this.resetInput();
      this.tagsFilter.add(tag);
      this.close();
    });
    item.addEventListener("mouseover", (event) => {
      const activeItem = find(Array.from(this.menu.children), element => element.classList.contains("active"));
      this.selectItem(activeItem, event.target);

      // Prevent next hide for letting user add a tag by "clicking" it
      this.cancelNextHide = true;
    });

    return item;
  }

  resetInput() {
    this.search      = "";
    this.input.value = this.search;
  }
  focus() {
    this.input.focus();
  }
  open() {
    if (this.opened) return;
    this.Dropdown.show();
  }
  close() {
    if (!this.opened) return;
    if (this.cancelNextHide) {
      this.cancelNextHide = false;
      return;
    }
    if (!this.container.parentElement.classList.contains("col-2")) {
      this.Dropdown.hide();
    }
  }
  emptyDropdown() {
    this.menu.innerHTML = "";
  }
  selectItem(active, item) {
    if (active) {
      active.classList.remove("active");
      active.removeAttribute("aria-current");
    }
    item.classList.add("active");
    item.setAttribute("aria-current", "true");
    item.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  /**
   * @param {string} value
   */
  onInputChange(value) {
    const newTerm = replaceAccentuedChars(value).toLowerCase();
    if (newTerm === this.search && value.length > 0) return;
    if (value.length === 0) {
      this.close();
    }

    this.search = newTerm;
    this.update();
  }

  /**
   * @param {IRecipe[]} recipes
   * @return {Tag[]}
   */
  reduce(recipes) {
    const reducer = (tags, recipe) => {
      forEach(this.extractor(recipe), t => tags.push(t));
      return tags;
    };
    const tags    = reduce(recipes, reducer, /** @type {Tag[]} */[]);

    const searchFilter        = (tag) => {
      return tag.value.startsWith(this.search)
             || tag.value.endsWith(this.search)
             || tag.value.includes(this.search);
    };
    const effectiveTagsFilter = (tag) => {
      const finder   = (t) => t.value === tag.value;
      const foundIdx = findIndex(this.tagsFilter.tagsDisplayHelper.list, finder);
      return foundIdx === -1;
    };
    const effectiveTagsCount  = this.tagsFilter.tagsDisplayHelper.count;

    return effectiveTagsCount > 0
           ? filter(filter(tags, searchFilter), effectiveTagsFilter)
           : filter(tags, searchFilter);
  }
  update() {
    const tags = this.reduce(this.tagsFilter.reduced);
    this.tags.setTags(tags, false, false);
    this.render();
  }
  render() {
    const tags        = this.tags.list;
    // const nbTags      = tags.length;
    const itemsPerCol = 10;
    const maxCols     = 3;
    const maxItems    = itemsPerCol * maxCols;

    this.emptyDropdown();

    const displayedItems = reduce(tags, (items, tag) => items.length < maxItems ? [...items, tag] : items, []);
    forEach(displayedItems, (tag) => this.menu.appendChild(this.itemFactory(tag)));
  }

  init() {
    this.Dropdown = window.bootstrap.Dropdown.getOrCreateInstance(this.button);

    this.button.addEventListener("hide.bs.dropdown", (event) => {
      if (this.cancelNextHide) {
        event.preventDefault();
        this.cancelNextHide = false;
      } else {
        this.focus();
      }
    });
    this.button.addEventListener("hidden.bs.dropdown", () => {
      this.opened = false;
      this.container.parentElement.classList.remove("col-8");
      this.container.parentElement.classList.add("col-2");
    });
    this.button.addEventListener("shown.bs.dropdown", () => {
      this.opened = true;

      if (this.container.parentElement.classList.contains("col-2")) {
        this.container.parentElement.classList.remove("col-2");
        this.container.parentElement.classList.add("col-8");
      }

      this.focus();
    });
    this.button.addEventListener("click", () => {
      if (!this.opened) {
        this.cancelNextHide = true;
      }
    });

    // Search & Arrows navigation
    this.input.addEventListener("click", () => {
      if (this.opened) {
        this.cancelNextHide = true;
      }
    });
    this.input.addEventListener("keydown", (event) => {
      const { code } = event;

      const noItems      = this.menu.childElementCount === 0;
      const activeItem   = this.menu.querySelector(".active");
      const previousItem = !activeItem ? null : activeItem.previousElementSibling;
      const nextItem     = !activeItem ? null : activeItem.nextElementSibling;

      switch (code) {
        case "ArrowDown":
          if (noItems) {
            this.close();
            break;
          }
          this.open();
          this.selectItem(activeItem, (nextItem || this.menu.firstElementChild));
          break;
        case "ArrowUp":
          if (noItems) {
            this.close();
            break;
          }
          this.open();
          this.selectItem(activeItem, (previousItem || this.menu.lastElementChild));
          break;
        case "Escape":
          event.preventDefault();
          this.close();
          break;
        case "Tab":
          const nextSearchboxEl = event.shiftKey
                                  ? this.container.parentElement.previousElementSibling?.firstElementChild
                                  : this.container.parentElement.nextElementSibling?.firstElementChild;
          if (nextSearchboxEl) {
            // Focusing next (or previous) searchbox
            event.preventDefault();
            const type = split(nextSearchboxEl.id, "-")[1];
            if (includes(Object.values(TagType), type)) {
              this.tagsFilter.app.searchboxes[/** @type {TagType} */type].focus();
            }
          } else if (event.shiftKey) {
            // Focusing search filter input because no previous searchbox
            event.preventDefault();
            this.tagsFilter.app.search.focus();
          } else {
            // Focus first recipe found in list
            if (this.tagsFilter.app.recipes.displayed.length > 0) {
              event.preventDefault();
            }
            this.tagsFilter.app.recipes.helper.focusFirst();
          }
          break;
        default:
          this.open();
          return;
      }
    });
    this.input.addEventListener("keyup", (event) => {
      const { code, target } = event;

      const activeItem = this.menu.querySelector(".active");
      switch (code) {
        case "ArrowUp":
        case "ArrowDown":
          return;
        case "Enter":
          if (!activeItem) break;
          // Select active item
          activeItem.click();
          break;
        default:
          this.onInputChange(target.value);
          return;
      }

      if (this.search.length > 0) {
        this.open();
      }
    });
    this.input.addEventListener("blur", () => {
      this.close();
      this.resetInput();
    });

    this.update();
  }
}

/**
 * @param {{
 *   type: TagType,
 *   tagsFilter: TagsFilter,
 *   extractor: (recipe: IRecipe) => Tag[],
 *   container: HTMLElement
 * }} data
 * @return {SearchboxHelper}
 */
const createSearchbox = (data) => {
  return new SearchboxHelper(data.tagsFilter, data.container, data.type, data.extractor);
};

export default createSearchbox;
