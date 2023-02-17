import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import RecipesContext from '../context/RecipesContext';
import { requestDrinkByCategory } from '../services/recipesAPI';
import iconDrinks from '../images/iconDrinks.png';
import allDrinks from '../images/allDrinks.png';
import ordinaryDrink from '../images/ordinaryDrink.png';
import cocktail from '../images/cocktail.png';
import shake from '../images/shake.png';
import other from '../images/other.png';
import cocoa from '../images/cocoa.png';

function Drinks() {
  const {
    categories,
    filteredRecipes,
    responseRecipes,
    setFilteredRecipes,
    showFilteredRecipes,
    setShowFilteredRecipes,
  } = useContext(RecipesContext);

  const drinksCards = () => {
    if (showFilteredRecipes) {
      const cards = filteredRecipes.map((item, index) => {
        const { strDrinkThumb, strDrink, idDrink } = item;
        return (
          <Link key={ index } to={ `drinks/${idDrink}` } className="card-title">
            <div
              data-testid={ `${index}-recipe-card` }
              className="recipes-card"
            >
              <img
                src={ strDrinkThumb }
                alt={ strDrink }
                data-testid={ `${index}-card-img` }
                className="meal-img"
              />

              <div className="card-title-container">
                <span
                  data-testid={ `${index}-card-name` }
                  className="card-title"
                >
                  { strDrink }
                </span>
              </div>
            </div>
          </Link>
        );
      });
      return cards;
    }
    return responseRecipes.map((item, index) => {
      const { strDrinkThumb, strDrink, idDrink } = item;
      return (
        <Link key={ index } to={ `drinks/${idDrink}` } className="card-title">
          <div
            data-testid={ `${index}-recipe-card` }
            className="recipes-card"
          >
            <img
              src={ strDrinkThumb }
              alt={ strDrink }
              data-testid={ `${index}-card-img` }
              className="meal-img"
            />

            <div className="card-title-container">
              <span
                data-testid={ `${index}-card-name` }
                className="card-title"
              >
                { strDrink }
              </span>
            </div>
          </div>
        </Link>
      );
    });
  };

  const onClickAllFilter = () => {
    setFilteredRecipes(responseRecipes);
  };

  const onClickCategoryButton = async ({ target: { name } }) => {
    const response = await requestDrinkByCategory(name);
    const result12 = await response.drinks.filter((item, index) => {
      const sizelimit = 12;
      if (index < sizelimit) {
        return item;
      }
      return '';
    });
    setFilteredRecipes(result12);
    setShowFilteredRecipes((prevState) => !prevState);
  };

  return (
    <div>
      <div className="title-container">
        <img src={ iconDrinks } alt="icon drink" />
        <span className="recipes-title">Drinks</span>
      </div>
      <div className="categories-container">
        <button
          type="button"
          data-testid="All-category-filter"
          onClick={ onClickAllFilter }
          className="category-button"
        >
          <img src={ allDrinks } alt="all-logo" className="category-img" />
        </button>
        {
          categories.map((item, index) => (
            <button
              type="button"
              key={ index }
              data-testid={ `${item}-category-filter` }
              name={ item }
              onClick={ onClickCategoryButton }
              className="category-button"
            >
              { item === 'Ordinary Drink' && (
                <img
                  src={ ordinaryDrink }
                  alt="ordinary drink"
                  name={ item }
                />
              )}
              { item === 'Cocktail' && (
                <img
                  src={ cocktail }
                  alt="cocktail"
                  name={ item }
                />
              )}
              { item === 'Shake' && (
                <img
                  src={ shake }
                  alt="shake"
                  name={ item }
                />
              )}
              { item === 'Other/Unknown' && (
                <img
                  src={ other }
                  alt="other"
                  name={ item }
                />
              )}
              { item === 'Cocoa' && (
                <img
                  src={ cocoa }
                  alt="cocoa"
                  name={ item }
                />
              )}

            </button>
          ))
        }
      </div>
      <div className="cards-container">
        { drinksCards() }
      </div>
    </div>

  );
}

export default Drinks;
