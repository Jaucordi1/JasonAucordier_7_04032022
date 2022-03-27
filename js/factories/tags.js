export class TagFactory {
  /**
   * @param {Tag} tag
   * @return {HTMLButtonElement}
   */
  static getTagDOM(tag) {
    const icon = document.createElement("i");
    icon.classList.add("bi", "bi-x-circle");
    icon.style.marginLeft = ".5em";

    const badge = document.createElement("button");
    badge.setAttribute("type", "button");
    badge.classList.add("btn", "btn-" + tag.color, "btn-sm");
    badge.dataset.type  = tag.type;
    badge.dataset.value = tag.value;
    badge.textContent   = tag.label;
    badge.appendChild(icon);

    return badge;
  }
}
