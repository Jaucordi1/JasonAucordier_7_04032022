// DONE
class SearchboxFactory {
  /**
   * @param {string} label
   * @param {string} value
   * @return {HTMLLIElement}
   */
  getDropdownItem(label, value) {
    const item = document.createElement("li");
    item.classList.add("dropdown-item");
    item.textContent   = label;
    item.dataset.value = value;

    return item;
  }
}
