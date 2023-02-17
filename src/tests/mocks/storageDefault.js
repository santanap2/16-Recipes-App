const mealName = 'Spicy Arrabiata Penne';
const mealLink = 'https://www.themealdb.com/images/media/meals/ustsqw1468250014.jpg';
const drinkLink = 'https://www.thecocktaildb.com/images/media/drink/zvsre31572902738.jpg';
const drinkName = 'Aquamarine';

export const storageDefault = {
  user: { email: 'email@test.com' },
  mealsToken: '1',
  drinksToken: '1',
};

export const favoriteMealRecipes = [{
  id: '52771',
  type: 'meal',
  nationality: 'Italian',
  category: 'Vegetarian',
  alcoholicOrNot: '',
  name: mealName,
  image: mealLink,
}];

export const favoriteDrinkRecipes = [{
  id: '178319',
  type: 'drink',
  nationality: '',
  category: 'Cocktail',
  alcoholicOrNot: 'Alcoholic',
  name: drinkName,
  image: drinkLink,
}];

export const doneMealRecipes = [{
  id: '52771',
  type: 'meal',
  nationality: 'Italian',
  category: 'Vegetarian',
  alcoholicOrNot: '',
  name: mealName,
  image: mealLink,
  doneDate: '23/06/2020',
  tags: ['Pasta', 'Curry'],
}];

export const doneDrinkRecipes = [{
  id: '178319',
  type: 'drink',
  nationality: '',
  category: 'Cocktail',
  alcoholicOrNot: 'Alcoholic',
  name: 'Aquamarine',
  image: 'https://www.thecocktaildb.com/images/media/drink/zvsre31572902738.jpg',
  doneDate: '23/6/2020',
  tags: [],
}];

export const favoriteRecipes = [...favoriteMealRecipes, ...favoriteDrinkRecipes];

export const doneRecipes = [...doneMealRecipes, ...doneDrinkRecipes];
