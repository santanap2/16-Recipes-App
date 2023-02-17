/* eslint-disable max-lines */
/* eslint-disable complexity */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useState, useEffect } from 'react';
import copy from 'clipboard-copy';
import { useParams } from 'react-router-dom';
import propTypes from 'prop-types';
import RecipesContext from '../context/RecipesContext';
import allMeals from '../images/allMeals.png';
import beef from '../images/beef.png';
import breakfast from '../images/breakfast.png';
import chicken from '../images/chicken.png';
import dessert from '../images/dessert.png';
import lamb from '../images/lamb.png';
import likeFull from '../images/likeFull.png';
import likeEmpty from '../images/likeEmpty.png';
import share from '../images/Share.png';

function MealsDetail({ url }) {
  const markedIngredients = JSON
    .parse(localStorage.getItem('inProgressRecipes')) || { drinks: {}, meals: {} };
  const { id } = useParams();
  const isCheckedInitial = markedIngredients.meals[id] || [];
  const [copySource, setCopySource] = useState(false);
  const [isFavorite, setIsFavorite] = useState('');
  const [isChecked, setIsChecked] = useState(isCheckedInitial);
  const { responseIdRecipe, recomendedRecipes,
    recipesInProgress, setFinishRecipeButtonDisabled } = useContext(RecipesContext);
  const {
    strMealThumb, strMeal, strCategory, strInstructions, strYoutube, idMeal, strArea,
  } = responseIdRecipe;

  const verify = strCategory !== 'Beef' && strCategory !== 'Breakfast'
    && strCategory !== 'Chicken' && strCategory !== 'Dessert'
    && strCategory !== 'Lamb';

  const allValues = Object.entries(responseIdRecipe);

  const ingredients = [];
  allValues.filter((item) => item[0].includes('Ingredient'))
    .filter((item) => item[1] !== null && item[1] !== '')
    .forEach((item) => ingredients.push(item[1]));

  const measures = [];
  allValues.filter((item) => item[0].includes('Measure'))
    .filter((item) => item[1] !== null && item[1] !== ' ')
    .forEach((item) => measures.push(item[1]));

  const gatheringIngredientsAndMeasures = ingredients.map((ingredient, i) => measures
    .map((measure, index) => {
      if (i === index) {
        const both = ` ${ingredient} - ${measure}`;
        return both;
      }
      return '';
    }));

  const ingredientsAndMeasures = [];
  gatheringIngredientsAndMeasures.forEach((one) => {
    ingredientsAndMeasures.push(one.filter((item) => item !== ''));
  });

  let linkEmbed;
  const linkEmbedStart = 32;
  if (strYoutube) linkEmbed = strYoutube.substring(linkEmbedStart);

  useEffect(() => {
    const favoriteRecipes = JSON.parse(localStorage.getItem('favoriteRecipes'));
    if (favoriteRecipes !== null) {
      setIsFavorite(favoriteRecipes.some((item) => item.id === idMeal));
    }
    const ingredientsSavedStorage = JSON.parse(localStorage.getItem('inProgressRecipes'));
    if (ingredientsSavedStorage?.meals[id]) {
      setIsChecked(ingredientsSavedStorage.meals[id]);
    }
  }, [idMeal]);

  const onClickShareButton = () => {
    setCopySource(true);
    copy(`http://localhost:3000${url}`);
  };

  useEffect(() => {
    if (isChecked.length === ingredientsAndMeasures.length) {
      setFinishRecipeButtonDisabled(false);
    } else {
      setFinishRecipeButtonDisabled(true);
    }
    const allRecipesInProgress = JSON.parse(localStorage.getItem('inProgressRecipes'))
      || { drinks: {}, meals: {} };
    const finalObj = {
      drinks: { ...allRecipesInProgress.drinks },
      meals: { ...allRecipesInProgress.meals, [id]: isChecked },
    };
    localStorage.setItem('inProgressRecipes', JSON.stringify(finalObj));
  }, [isChecked]);

  const onClickFavoriteButton = () => {
    setIsFavorite((prevState) => !prevState);
    const favoriteRecipes = JSON.parse(localStorage.getItem('favoriteRecipes'));
    const obj = {
      alcoholicOrNot: '',
      category: strCategory,
      id: idMeal,
      image: strMealThumb,
      name: strMeal,
      nationality: strArea,
      type: 'meal',
    };

    if (favoriteRecipes !== null) {
      const alreadyFavorite = favoriteRecipes.some((item) => item.id === idMeal);

      if (alreadyFavorite) {
        const newFavorites = favoriteRecipes.filter((item) => item.id !== idMeal);
        localStorage.setItem('favoriteRecipes', JSON.stringify(newFavorites));
      }
      if (!alreadyFavorite) {
        const favorites = JSON.stringify([...favoriteRecipes, obj]);
        localStorage.setItem('favoriteRecipes', favorites);
      }
    } else {
      localStorage.setItem('favoriteRecipes', JSON.stringify([obj]));
    }
  };

  const handleChange = (target) => {
    const { name, checked } = target;
    if (checked) {
      setIsChecked([...isChecked, name]);
    } else {
      const newCheked = [...isChecked];
      setIsChecked(newCheked.filter((check) => check !== name));
    }
  };

  return (
    <div>
      <div className="img-container">
        <img
          src={ strMealThumb }
          alt={ strMeal }
          data-testid="recipe-photo"
          className="recipe-img"
        />
      </div>

      <div className="recipe-title-container">
        <span data-testid="recipe-title" className="recipe-title">
          { strMeal }
        </span>
      </div>

      <div className="img-buttons">
        <div data-testid="recipe-category" className="recipe-category">
          { verify && <img src={ allMeals } alt="allMeals" className="img-category" />}
          { strCategory === 'Chicken' && (
            <img src={ chicken } alt="chicken" className="img-category" />)}
          { strCategory === 'Beef' && (
            <img src={ beef } alt="beef" className="img-category" />)}
          { strCategory === 'Breakfast' && (
            <img src={ breakfast } alt="breakfast" className="img-category" />)}
          { strCategory === 'Dessert' && (
            <img src={ dessert } alt="dessert" className="img-category" />)}
          { strCategory === 'Lamb' && (
            <img src={ lamb } alt="lamb" className="img-category" />)}
          { strCategory }
        </div>
        <div className="buttons-container">
          <button
            type="button"
            data-testid="favorite-btn"
            onClick={ onClickFavoriteButton }
          >
            { isFavorite ? (
              <img
                src={ likeFull }
                alt="favorite-icon"
              />
            ) : (
              <img
                src={ likeEmpty }
                alt="favorite-icon"
              />
            )}
          </button>
          <button
            type="button"
            data-testid="share-btn"
            onClick={ onClickShareButton }
            onKeyPress={ () => {} }
            tabIndex="0"
          >
            <img src={ share } alt="compartilhar" />
          </button>
          { copySource && <span className="pop-up-copied">Link copied!</span> }
        </div>
      </div>

      <div className="ingredients-container">
        <span className="ingredients-title">Ingredients</span>
        <ul className="ul-ingredients">
          {recipesInProgress ? (
            ingredientsAndMeasures.map((item, index) => (
              <li key={ index } className="ingredient-li">
                <input
                  type="checkbox"
                  id={ index }
                  name={ item }
                  checked={ isChecked.some((elemen) => elemen.includes(item)) }
                  onChange={ (event) => handleChange(event.target) }
                  className="ingredient-checkbox"
                />
                <label
                  htmlFor={ index }
                  data-testid={ `${index}-ingredient-step` }
                  className={ isChecked.some((elemen) => elemen
                    .includes(item)) ? 'recipeInProgressChecked' : '' }
                >
                  { item }
                </label>
              </li>
            ))
          ) : (
            ingredientsAndMeasures.map((item, index) => (
              <li
                key={ index }
                data-testid={ `${index}-ingredient-name-and-measure` }
                className="li-ingredient"
              >
                { item }
              </li>))
          )}
        </ul>
      </div>

      <div className="instructions-container">
        <span className="instructions-title">Instructions</span>
        <span className="instructions" data-testid="instructions">
          { strInstructions }
        </span>
      </div>

      <div className="video-container">
        <span className="video-title">Video</span>
        <iframe
          width="560"
          height="315"
          src={ `https://www.youtube.com/embed/${linkEmbed}` }
          title="YouTube video player"
          data-testid="video"
          className="video-yt"
        />
      </div>

      <div className="recommended-container">
        <span className="recommended-title">Recommended</span>
        <div className="recomended-recipes">
          { recomendedRecipes.map((item, index) => {
            const { strDrinkThumb, strDrink } = item;
            const limitSize = 6;
            if (index < limitSize) {
              return (
                <div
                  key={ index }
                  data-testid={ `${index}-recommendation-card` }
                  className="recipes-card"
                >
                  <img src={ strDrinkThumb } alt={ strDrink } className="meal-img" />
                  <div className="card-title-container">
                    <span
                      data-testid={ `${index}-recommendation-title` }
                      className="recommended-card-title"
                    >
                      { strDrink }
                    </span>
                  </div>
                </div>
              );
            }
            return '';
          })}
        </div>
      </div>
    </div>
  );
}

MealsDetail.propTypes = {
  url: propTypes.string.isRequired,
};

export default MealsDetail;
