/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useContext, useState } from 'react';
import propTypes from 'prop-types';
import { requestRecipes } from '../services/recipesAPI';
import RecipesContext from '../context/RecipesContext';
import MealsDetail from '../components/MealsDetail';
import DrinksDetail from '../components/DrinksDetail';
import '../css/RecipesDetails.css';

function RecipeDetails({ history: { push }, match: { params: { id }, url } }) {
  const [isRecipeDone, setIsRecipeDone] = useState(false);
  const [recipesProgressButton, setRecipesProgressButton] = useState('Start Recipe');
  const { setResponseIdRecipe, setRecomendedRecipes, setPageTitle,
  } = useContext(RecipesContext);

  const dbName = { meals: 'meal', drinks: 'cocktail' };
  const SEVEN = 7;
  const routeName = window.location.pathname.substring(1, SEVEN);

  const meals = 'meals';
  const drinks = 'drinks';

  let db;
  let key;
  if (routeName.includes(meals)) {
    db = dbName[meals];
    key = meals;
  }
  if (routeName === drinks) {
    db = dbName[drinks];
    key = drinks;
  }

  const readLocalStorage = () => {
    const doneRecipes = JSON.parse(localStorage.getItem('doneRecipes'));
    const startedRecipes = JSON.parse(localStorage.getItem('inProgressRecipes'));
    if (doneRecipes) {
      setIsRecipeDone(doneRecipes.some((item) => item.id === id));
    } else {
      setIsRecipeDone(false);
    }
    if (startedRecipes && startedRecipes[key] && startedRecipes[key][id].length > 0) {
      setRecipesProgressButton('Continue Recipe');
    } else {
      setRecipesProgressButton('Start Recipe');
    }
  };

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

  const requestRecomendedRecipe = async () => {
    let type;
    if (routeName.includes(meals)) {
      type = dbName[drinks];
    }
    if (routeName === drinks) {
      type = dbName[meals];
    }

    const URL = `https://www.the${type}db.com/api/json/v1/1/search.php?s=`;
    const response = await requestRecipes(URL);
    if (routeName.includes(meals)) {
      setRecomendedRecipes(response.drinks);
    }
    if (routeName.includes(drinks)) {
      setRecomendedRecipes(response.meals);
    }
  };

  useEffect(() => {
    requestRecipeForId();
    requestRecomendedRecipe();
    readLocalStorage();
  }, []);

  const onClickStartRecipe = () => {
    setPageTitle(key[0].toUpperCase() + key.slice(1));
    setIsRecipeDone(true);
    push(`/${key}/${id}/in-progress`);
  };

  return (
    <div>

      { routeName === 'meals/' && <MealsDetail url={ url } /> }
      { routeName === 'drinks' && <DrinksDetail url={ url } /> }

      {
        !isRecipeDone && (
          <button
            type="button"
            data-testid="start-recipe-btn"
            className="start-recipe-button"
            onClick={ onClickStartRecipe }
          >
            { recipesProgressButton }
          </button>
        )
      }

    </div>
  );
}

RecipeDetails.propTypes = {
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

export default RecipeDetails;
