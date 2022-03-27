import { TagsDisplayHelper }                              from "./tags.js";
import { replaceAccentuedChars }                          from "../utils.js";
import { filter, find, forEach, includes, reduce, split } from "../utils/array.js";
import { TagType }                                        from "../data/tags.js";

// DONE
export class SearchboxHelper {
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
    this.render();
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
      console.log("Item clicked");

      event.preventDefault();
      this.cancelNextHide = true;
      this.resetInput();
      this.tagsFilter.add(tag);
    });
    item.addEventListener("mouseover", (event) => {
      const activeItem = find(Array.from(this.menu.children), element => element.classList.contains("active"));
      this.selectItem(activeItem, event.target);
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
    if (this.container.parentElement.classList.contains("col-2")) {
      this.Dropdown.show();
    }
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
    if (newTerm === this.search) return;

    this.search = newTerm;
    this.update();
  }

  /**
   * @param {IRecipe[]} recipes
   * @return {Tag[]}
   */
  reduce(recipes) {
    console.debug(`[REDUCE] (${this.type}) SearchboxHelper`);

    const reducer = (tags, recipe) => {
      forEach(this.extractor(recipe), t => tags.push(t));
      return tags;
    };
    const tags    = reduce(recipes, reducer, /** @type {Tag[]} */[]);

    return filter(tags, (tag) => {
      return tag.value.startsWith(this.search)
             || tag.value.endsWith(this.search)
             || tag.value.includes(this.search);
    });
  }
  update() {
    console.debug(`[UPDATE] (${this.type}) SearchboxHelper`);

    const tags = this.reduce(this.tagsFilter.reduced);
    this.tags.setTags(tags, false, false);
    this.render();
  }
  render() {
    console.debug(`[RENDER] (${this.type}) SearchboxHelper`);

    const tags     = this.tags.list;
    const maxItems = 30;

    this.emptyDropdown();
    /* TODO Choose between functional OR native loops
     * while & .shift()
     */
    while (tags.length > 0 && this.menu.childElementCount < maxItems) {
      const tag  = tags.shift();
      const item = this.itemFactory(tag);
      this.menu.appendChild(item);
    }
  }

  init() {
    console.debug(`[INIT] (${this.type}) SearchboxHelper`);

    this.Dropdown = window.bootstrap.Dropdown.getOrCreateInstance(this.button);

    this.button.addEventListener("hide.bs.dropdown", (event) => {
      if (this.cancelNextHide) {
        this.cancelNextHide = false;
        event.preventDefault();
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

      this.open();
    });
    this.input.addEventListener("blur", () => {
      this.close();
      this.resetInput();
    });

    this.update();
  }
}
