/* eslint-disable max-len */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect } from 'react';
import propTypes from 'prop-types';
import RecipesContext from '../context/RecipesContext';
import MealsDetail from '../components/MealsDetail';
import DrinksDetail from '../components/DrinksDetail';
import { requestRecipes } from '../services/recipesAPI';
import '../css/RecipesInProgress.css';

function RecipeInProgress({ history: { push }, match: { params: { id }, url } }) {
  const { setShowSearchButton, setPageTitle,
    setRecipesInProgress, setResponseIdRecipe,
    finishRecipeButtonDisabled, responseIdRecipe } = useContext(RecipesContext);
  const SEVEN = 7;
  const routeName = window.location.pathname.substring(1, SEVEN);

  const meals = 'meals';
  const drinks = 'drinks';
  const dbName = { meals: 'meal', drinks: 'cocktail' };
  let db;
  if (routeName.includes(meals)) {
    db = dbName[meals];
  }
  if (routeName === drinks) {
    db = dbName[drinks];
  }

  const requestRecipeForId = async () => {
    const URL = `https://www.the${db}db.com/api/json/v1/1/lookup.php?i=${id}`;
    const response = await requestRecipes(URL);
    if (routeName.includes(meals)) {
      setResponseIdRecipe(response.meals[0]);
    }
    if (routeName.includes(drinks)) {
      setResponseIdRecipe(response.drinks[0]);
    }
  };

  useEffect(() => {
    setShowSearchButton(true);
    requestRecipeForId();
    setPageTitle('teste');
    setRecipesInProgress(true);
  }, []);

  const finishRecipeButton = () => {
    const {
      strMealThumb, strMeal, strCategory, idMeal, strArea,
      strAlcoholic, strDrink, strDrinkThumb, strTags, idDrink,
    } = responseIdRecipe;

    const obj = [{
      id: (routeName === 'drinks' ? idDrink : idMeal),
      type: (routeName === 'drinks' ? 'drink' : 'meal'),
      nationality: strArea,
      category: strCategory,
      alcoholicOrNot: (routeName === 'drinks' ? strAlcoholic : ''),
      name: (routeName === 'drinks' ? strDrink : strMeal),
      image: (routeName === 'drinks' ? strDrinkThumb : strMealThumb),
      doneDate: (new Date(Date.now()).toLocaleDateString()),
      tags: (strTags !== null ? strTags.split(',') : '') || [],
    }];

    const prevDoneRecipes = JSON.parse(localStorage.getItem('doneRecipes')) || [];
    localStorage.setItem('doneRecipes', JSON.stringify([...prevDoneRecipes, ...obj]));
    setRecipesInProgress(false);
    push('/done-recipes');
  };

  return (
    <div>
      { routeName === 'meals/' && <MealsDetail url={ url } /> }
      { routeName === 'drinks' && <DrinksDetail url={ url } /> }

      <button
        data-testid="finish-recipe-btn"
        type="button"
        onClick={ finishRecipeButton }
        disabled={ finishRecipeButtonDisabled }
        className="finish-recipe-button"
      >
        Finish Recipe
      </button>

    </div>
  );
}

RecipeInProgress.propTypes = {
  match: propTypes.shape({
    params: propTypes.shape({
      id: propTypes.string.isRequired }).isRequired,
    url: propTypes.string.isRequired,
  }).isRequired,
  location: propTypes.shape({
    pathname: propTypes.string.isRequired,
  }).isRequired,
  history: propTypes.shape({
    push: propTypes.func.isRequired,
  }).isRequired,
};

export default RecipeInProgress;
