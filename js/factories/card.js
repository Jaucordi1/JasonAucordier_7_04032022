export function recipeFactory(recipe) {
  function getCardImgDOM() {
    const imgEl = document.createElement("img");
    imgEl.classList.add("card-img-top", "ratio", "ratio-16x9");
    imgEl.src = 'https://via.placeholder.com/640x360/C7BEBE/?text=Photo+recette';
    imgEl.setAttribute("alt", "");

    return imgEl;
  }

  function getDurationDOM() {
    const iconEl = document.createElement("i");
    iconEl.classList.add("bi", "bi-clock", "bi-clock-bold");

    const timeEl       = document.createElement("span");
    timeEl.textContent = `${recipe.time} min`;

    const durationEl = document.createElement("span");
    durationEl.classList.add("badge", "text-dark", "d-flex", "gap-2");
    durationEl.append(iconEl, timeEl);

    return durationEl;
  }
  function getCardTitleDOM() {
    const durationEl = getDurationDOM();

    const headingEl = document.createElement("h5");
    headingEl.classList.add("card-title", "d-flex", "justify-content-between", "mb-4");
    headingEl.textContent = recipe.name;
    headingEl.appendChild(durationEl);

    return headingEl;
  }

  /**
   * @param {IIngredient} ingredient
   * @return {HTMLLIElement}
   */
  function getRecipeIngredientDOM(ingredient) {
    const { unit, quantity, quantite, ingredient: name } = ingredient;
    const ingredientQuantity                             = quantity !== undefined ? quantity : quantite;

    const ingredientNameEl       = document.createElement("strong");
    ingredientNameEl.textContent = `${name}${ingredientQuantity !== undefined ? ": " : ""}`;

    const quantityEl       = document.createElement("span");
    quantityEl.textContent = [
      ingredientQuantity?.toString(10),
      unit
    ].filter((v) => !!v).join(" ");

    const itemEl = document.createElement("li");
    // itemEl.classList.add("list-group-item");
    itemEl.append(ingredientNameEl, quantityEl);

    return itemEl;
  }
  function getRecipeIngredientsDOM() {
    const listEl = document.createElement("ul");
    listEl.classList.add("list-unstyled");

    for (const item of recipe.ingredients) {
      listEl.appendChild(getRecipeIngredientDOM(item));
    }

    const colEl = document.createElement("div");
    colEl.classList.add("col-6");
    colEl.appendChild(listEl);

    return colEl;
  }
  function getRecipeTextDOM() {
    const paragraphEl = document.createElement("p");
    paragraphEl.classList.add("card-text", "fs-6");
    paragraphEl.textContent = recipe.description.substring(0, 183);

    const ellipsis = document.createElement('span');
    ellipsis.textContent = '…';
    paragraphEl.appendChild(ellipsis);

    const colEl = document.createElement("div");
    colEl.classList.add("col-6");
    colEl.appendChild(paragraphEl);

    return colEl;
  }
  function getRecipeDOM() {
    const rowEl = document.createElement("div");
    rowEl.classList.add("row", "lh-sm");
    rowEl.append(
      getRecipeIngredientsDOM(),
      getRecipeTextDOM()
    );

    return rowEl;
  }

  function getColumnDOM() {
    const colEl = document.createElement("div");
    colEl.classList.add("col-4");
    // colEl.setAttribute('href', '#');

    return colEl;
  }
  function getCardDOM() {
    const cardEl = document.createElement("div");
    cardEl.classList.add("card");

    return cardEl;
  }
  function getCardBodyDOM() {
    const cardBodyEl = document.createElement("div");
    cardBodyEl.classList.add("card-body");
    cardBodyEl.append(
      getCardTitleDOM(),
      getRecipeDOM()
    );

    return cardBodyEl;
  }

  function getRecipeCardDOM() {
    const cardEl = getCardDOM();
    const colEl  = getColumnDOM();

    cardEl.append(getCardImgDOM(), getCardBodyDOM());
    colEl.append(cardEl);

    return colEl;
  }

  return { getRecipeCardDOM };
}
