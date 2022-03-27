import { TagsDisplayHelper } from "./tags.js";

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

    this.tags = new TagsDisplayHelper(this.menu, this.itemFactory.bind(this), this.onTagsChange.bind(this));

    this.search         = "";
    this.cancelNextHide = false;
  }

  /**
   * @param {Tags} tags
   */
  onTagsChange(tags) {
    // this.update();
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
      this.tagsFilter.add(tag);
    });

    return item;
  }

  open() {
    if (this.container.parentElement.classList.contains("col-2")) {
      this.Dropdown.show();
      this.input.focus();
    }
  }
  close() {
    if (!this.container.parentElement.classList.contains("col-2")) {
      this.Dropdown.hide();
    }
  }
  setItems(items) {
    this.menu.innerHTML = "";
    items.forEach((item) => this.menu.appendChild(item));
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
    item.scrollIntoView({ behavior: "smooth" });
  }

  /**
   * @param {IRecipe[]} recipes
   */
  reduce(recipes) {
    return recipes.reduce((tags, recipe) => {
      tags.push(...this.extractor(recipe));
      return tags;
    }, /** @type {Tag[]} */[]);
  }
  update() {
    console.debug("[UPDATE] SearchboxHelper");
    const tags = this.reduce(this.tagsFilter.reduced);
    this.tags.setTags(tags, false);
    this.render();
  }
  render() {
    console.debug("[RENDER] SearchboxHelper");
    const tags     = this.tags.list;
    const maxItems = 30;

    this.emptyDropdown();
    while (tags.length > 0 && this.menu.childElementCount < maxItems) {
      const tag  = tags.shift();
      const item = document.createElement("li");
      item.classList.add("dropdown-item");
      item.textContent = tag.label;

      item.addEventListener("click", (event) => {
        this.tagsFilter.add(tag);
        // TODO Maybe this.update() ?
      });

      this.menu.appendChild(item);
    }
  }
  init() {
    console.debug(`[INIT] (${this.type}) SearchboxHelper`);

    this.Dropdown = window.bootstrap.Dropdown.getOrCreateInstance(this.button);

    this.button.addEventListener("hide.bs.dropdown", (event) => {
      if (this.cancelNextHide) {
        event.preventDefault();
        this.cancelNextHide = false;
      } else {
        this.container.parentElement.classList.remove("col-8");
        this.container.parentElement.classList.add("col-2");
      }
    });
    this.button.addEventListener("show.bs.dropdown", () => {
      if (this.container.parentElement.classList.contains("col-2")) {
        this.container.parentElement.classList.remove("col-2");
        this.container.parentElement.classList.add("col-8");
      }
    });

    // Search & Arrows navigation
    this.input.addEventListener("focus", (event) => {
      this.cancelNextHide = true;
      this.open();
    });
    this.input.addEventListener("click", (event) => {
      this.cancelNextHide = true;
      this.open();
      this.input.focus();
    });
    this.input.addEventListener("blur", (event) => {
      this.cancelNextHide = false;
    });
    this.input.addEventListener("keydown", (event) => {
      const { code } = event;

      const noItems      = this.menu.childElementCount === 0;
      const activeItem   = this.menu.querySelector(".active");
      const previousItem = !activeItem ? null : activeItem.previousElementSibling;
      const nextItem     = !activeItem ? null : activeItem.nextElementSibling;

      switch (code) {
        case "ArrowDown":
          if (!noItems) {
            this.selectItem(activeItem, (nextItem || this.menu.firstElementChild));
          }
          break;
        case "ArrowUp":
          if (!noItems) {
            this.selectItem(activeItem, (previousItem || this.menu.lastElementChild));
          }
          break;
        default:
          break;
      }

      this.open();
      this.input.focus();
    });
    this.input.addEventListener("keyup", (event) => {
      const { code, target } = event;

      // Refresh search term
      this.search = target.value;

      const activeItem = this.menu.querySelector(".active");
      switch (code) {
        case "ArrowUp":
        case "ArrowDown":
          break;
        case "Enter":
          if (!activeItem) break;
          activeItem.click();
          break;
        default:
          this.emptyDropdown();
          this.setupDropdownItems(this.menu, this.items.filter((str) => {
            const candidate = str.toLowerCase();
            const reference = this.search.toLowerCase();
            return candidate.startsWith(reference)
                   || candidate.endsWith(reference)
                   || candidate.includes(reference);
          }));
          break;
      }

      this.open();
      this.input.focus();
    });

    this.update();
  }
}
