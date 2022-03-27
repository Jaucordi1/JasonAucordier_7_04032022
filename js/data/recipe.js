export class Recipe {
  /**
   * @param {IRecipe} data
   */
  constructor(data) {
    this._data = Object.seal(Object.freeze(data));
  }

  get id() {
    return this._data.id;
  }
  get name() {
    return this._data.name;
  }
  get description() {
    return this._data.description;
  }
  get servings() {
    return this._data.servings;
  }
  get time() {
    return this._data.time;
  }
  get ingredients() {
    return this._data.ingredients;
  }
  get ustensils() {
    return this._data.ustensils;
  }
  get appliance() {
    return this._data.appliance;
  }

  /**
   * @param {Recipe} recipe
   * @returns {boolean}
   */
  isEqual(recipe) {
    return this.id === recipe.id;
  }
}
