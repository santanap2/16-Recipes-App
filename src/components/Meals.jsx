import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import RecipesContext from '../context/RecipesContext';
import { requestMealByCategory } from '../services/recipesAPI';
import iconMeal from '../images/iconMeal.png';
import allMeals from '../images/allMeals.png';
import beef from '../images/beef.png';
import breakfast from '../images/breakfast.png';
import chicken from '../images/chicken.png';
import dessert from '../images/dessert.png';
import lamb from '../images/lamb.png';

function Meals() {
  const {
    categories,
    filteredRecipes,
    responseRecipes,
    setFilteredRecipes,
    showFilteredRecipes,
    setShowFilteredRecipes,
  } = useContext(RecipesContext);

  const mealsCards = () => {
    if (showFilteredRecipes) {
      const cards = filteredRecipes.map((item, index) => {
        const { strMealThumb, strMeal, idMeal } = item;
        return (
          <Link key={ index } to={ `meals/${idMeal}` } className="card-title">
            <div
              data-testid={ `${index}-recipe-card` }
              className="recipes-card"
            >
              <img
                src={ strMealThumb }
                alt={ strMeal }
                data-testid={ `${index}-card-img` }
                className="meal-img"
              />

              <div className="card-title-container">
                <span
                  data-testid={ `${index}-card-name` }
                  className="card-title"
                >
                  { strMeal }
                </span>
              </div>
            </div>
          </Link>
        );
      });
      return cards;
    }

    return responseRecipes.map((item, index) => {
      const { strMealThumb, strMeal, idMeal } = item;
      return (
        <Link key={ index } to={ `meals/${idMeal}` } className="card-title">
          <div
            data-testid={ `${index}-recipe-card` }
            className="recipes-card"
          >
            <img
              src={ strMealThumb }
              alt={ strMeal }
              data-testid={ `${index}-card-img` }
              className="meal-img"
            />

            <div className="card-title-container">
              <span
                data-testid={ `${index}-card-name` }
                className="card-title"
              >
                { strMeal }
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
    const response = await requestMealByCategory(name);
    const result12 = await response.meals.filter((item, index) => {
      const limitRecipes = 12;
      if (index < limitRecipes) {
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
        <img src={ iconMeal } alt="icon meal" />
        <span className="recipes-title">Meals</span>
      </div>
      <div className="categories-container">
        <button
          type="button"
          data-testid="All-category-filter"
          onClick={ onClickAllFilter }
          className="category-button"
        >
          <img src={ allMeals } alt="all-logo" className="category-img" />
        </button>

        {
          categories.map((item, index) => (
            <button
              type="button"
              key={ index }
              data-testid={ `${item}-category-filter` }
              onClick={ onClickCategoryButton }
              className="category-button"
            >
              { item === 'Beef' && (
                <img
                  src={ beef }
                  alt="beef-logo"
                  name={ item }
                />) }

              { item === 'Breakfast' && (
                <img
                  src={ breakfast }
                  alt="breakfast-logo"
                  name={ item }
                />) }

              { item === 'Chicken' && (
                <img
                  src={ chicken }
                  alt="chicken-logo"
                  name={ item }
                />) }

              { item === 'Dessert' && (
                <img
                  src={ dessert }
                  alt="dessert-logo"
                  name={ item }
                />) }

              { item === 'Goat' && (
                <img
                  src={ lamb }
                  alt="lamb-logo"
                  name={ item }
                />) }

            </button>
          ))
        }

      </div>
      <div className="cards-container">
        { mealsCards() }
      </div>
    </div>
  );
}

export default Meals;
