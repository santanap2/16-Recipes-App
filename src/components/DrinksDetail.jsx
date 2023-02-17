/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable max-lines */
/* eslint-disable complexity */
import React, { useContext, useState, useEffect } from 'react';
import copy from 'clipboard-copy';
import { useParams } from 'react-router-dom';
import RecipesContext from '../context/RecipesContext';
import likeFull from '../images/likeFull.png';
import likeEmpty from '../images/likeEmpty.png';
import share from '../images/Share.png';
import allDrinks from '../images/allDrinks.png';
import ordinaryDrink from '../images/ordinaryDrink.png';
import cocktail from '../images/cocktail.png';
import shake from '../images/shake.png';
import other from '../images/other.png';
import cocoa from '../images/cocoa.png';

function DrinksDetail() {
  const markedIngredients = JSON
    .parse(localStorage.getItem('inProgressRecipes')) || { drinks: {}, meals: {} };
  const { id } = useParams();
  const isCheckedInitial = markedIngredients.drinks[id] || [];
  const [copySource, setCopySource] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isChecked, setIsChecked] = useState(isCheckedInitial);
  const { responseIdRecipe, recomendedRecipes,
    recipesInProgress, setFinishRecipeButtonDisabled } = useContext(RecipesContext);
  const {
    strDrinkThumb, strDrink, strInstructions, strAlcoholic, idDrink, strCategory,
  } = responseIdRecipe;

  const verify = strCategory !== 'Ordinary Drink' && strCategory !== 'Cocktail'
    && strCategory !== 'Shake' && strCategory !== 'Other/Unknown'
    && strCategory !== 'Cocoa';

  const allValues = Object.entries(responseIdRecipe);

  const ingredients = [];
  allValues.filter((item) => item[0].includes('Ingredient'))
    .filter((item) => item[1] !== null && item[1] !== '')
    .forEach((item) => ingredients.push(item[1]));

  const measures = [];
  allValues.filter((item) => item[0].includes('Measure'))
    .filter((item) => item[1] !== null && item[1] !== '')
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

  useEffect(() => {
    const favoriteRecipes = JSON.parse(localStorage.getItem('favoriteRecipes'));
    if (favoriteRecipes !== null) {
      setIsFavorite(favoriteRecipes.some((item) => item.id === idDrink));
    }
    const ingredientsSavedStorage = JSON.parse(localStorage.getItem('inProgressRecipes'));
    if (ingredientsSavedStorage && ingredientsSavedStorage.drinks
      && ingredientsSavedStorage.drinks[idDrink]) {
      setIsChecked(ingredientsSavedStorage.drinks[idDrink]);
    }
  }, [idDrink]);

  useEffect(() => {
    if (isChecked.length === ingredientsAndMeasures.length) {
      setFinishRecipeButtonDisabled(false);
    } else {
      setFinishRecipeButtonDisabled(true);
    }

    const allRecipesInProgress = JSON.parse(localStorage.getItem('inProgressRecipes'))
      || { drinks: {}, meals: {} };
    const finalObj = {
      drinks: { ...allRecipesInProgress.drinks, [id]: isChecked },
      meals: { ...allRecipesInProgress.meals },
    };
    console.log(finalObj);

    localStorage.setItem('inProgressRecipes', JSON.stringify(finalObj));
  }, [isChecked]);

  const onClickShareButton = () => {
    setCopySource(true);
    copy(`http://localhost:3000/drinks/${idDrink}`);
  };

  const onClickFavoriteButton = () => {
    setIsFavorite((prevState) => !prevState);
    const favoriteRecipes = JSON.parse(localStorage.getItem('favoriteRecipes'));
    const obj = {
      alcoholicOrNot: strAlcoholic,
      category: strCategory,
      id: idDrink,
      image: strDrinkThumb,
      name: strDrink,
      nationality: '',
      type: 'drink',
    };

    if (favoriteRecipes !== null) {
      const alreadyFavorite = favoriteRecipes.some((item) => item.id === idDrink);

      if (alreadyFavorite) {
        const newFavorites = favoriteRecipes.filter((item) => item.id !== idDrink);
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
          src={ strDrinkThumb }
          alt={ strDrink }
          data-testid="recipe-photo"
          className="recipe-img"
        />
      </div>

      <div className="recipe-title-container">
        <span data-testid="recipe-title" className="recipe-title">{ strDrink }</span>
      </div>

      <div className="img-buttons">
        <div data-testid="recipe-category" className="recipe-category">
          { verify && <img src={ allDrinks } alt="allDrinks" className="img-category" />}
          { strCategory === 'Ordinary Drink' && (
            <img src={ ordinaryDrink } alt="ordinaryDrink" className="img-category" />)}
          { strCategory === 'Cocktail' && (
            <img src={ cocktail } alt="cocktail" className="img-category" />)}
          { strCategory === 'Shake' && (
            <img src={ shake } alt="shake" className="img-category" />)}
          { strCategory === 'Other/Unknown' && (
            <img src={ other } alt="dessert" className="img-category" />)}
          { strCategory === 'Cocoa' && (
            <img src={ cocoa } alt="lamb" className="img-category" />)}
          <div className="category-alcoholic">
            <span>{ strCategory }</span>
            <span>{ strAlcoholic }</span>
          </div>
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
          { recipesInProgress ? (
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
              </li>
            ))
          ) }
        </ul>
      </div>

      <div className="instructions-container">
        <span className="instructions-title">Instructions</span>
        <span className="instructions" data-testid="instructions">
          { strInstructions }
        </span>
      </div>

      <div className="recommended-container">
        <span className="recommended-title">Recommended</span>
        <div className="recomended-recipes">
          { recomendedRecipes.map((item, index) => {
            const { strMealThumb, strMeal } = item;
            const limitSize = 6;
            if (index < limitSize) {
              return (
                <div
                  key={ index }
                  data-testid={ `${index}-recommendation-card` }
                  className="recipes-card"
                >
                  <img src={ strMealThumb } alt={ strMeal } className="drink-img" />
                  <div className="card-title-container">
                    <span
                      data-testid={ `${index}-recommendation-title` }
                      className="recommended-card-title"
                    >
                      { strMeal }
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

export default DrinksDetail;
