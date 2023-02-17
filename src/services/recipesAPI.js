export const requestRecipes = async (url) => {
  try {
    const data = await fetch(url);
    const json = await data.json();
    return json;
  } catch (error) {
    return error;
  }
};

export const requestMealByCategory = async (category) => {
  try {
    const endpoint = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`;
    const data = await fetch(endpoint);
    const json = await data.json();
    return json;
  } catch (error) {
    return error;
  }
};

export const requestDrinkByCategory = async (category) => {
  try {
    const endpoint = `https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=${category}`;
    const data = await fetch(endpoint);
    const json = await data.json();
    return json;
  } catch (error) {
    return error;
  }
};
