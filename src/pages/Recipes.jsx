/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useContext } from 'react';
import propTypes from 'prop-types';
import '../css/Recipes.css';
import Header from '../components/Header';
import RecipesContext from '../context/RecipesContext';
import Footer from '../components/Footer';
import Meals from '../components/Meals';
import Drinks from '../components/Drinks';
import { requestRecipes } from '../services/recipesAPI';

function Recipes({ history: { push, location: { pathname } } }) {
  const {
    recipeDetail,
    setCategories,
    setFilteredRecipes,
    setResponseRecipes,
    setPageTitle,
    setShowSearchButton,
  } = useContext(RecipesContext);

  const dbName = {
    meals: 'meal',
    drinks: 'cocktail',
  };

  const routeName = window.location.pathname.substring(1);
  const db = dbName[routeName];

  const getCategories = async () => {
    const url = `https://www.the${db}db.com/api/json/v1/1/list.php?c=list`;
    const response = await requestRecipes(url);
    const categoriesObj = response[routeName].filter((item, index) => {
      const categoriesLimit = 5;
      if (index < categoriesLimit) {
        return item;
      }
      return '';
    });
    const categoriesArray = [];
    categoriesObj.forEach((item) => categoriesArray.push(item.strCategory));
    setCategories(categoriesArray);
  };

  useEffect(async () => {
    const url = `https://www.the${db}db.com/api/json/v1/1/search.php?s=`;
    const response = await requestRecipes(url);
    const recipes = response[routeName].filter((item, index) => {
      const limit = 12;
      if (index < limit) {
        return item;
      }
      return '';
    });
    setResponseRecipes(recipes);
    setFilteredRecipes(recipes);
    getCategories();

    setPageTitle(routeName[0].toUpperCase() + routeName.slice(1));
  }, [pathname]);

  useEffect(() => {
    if (recipeDetail.id !== '') {
      push(`${recipeDetail.type}/${recipeDetail.id}`);
    }
  }, [recipeDetail]);

  useEffect(() => {
    setShowSearchButton(true);
  });

  return (
    <div>
      <Header />
      <div className="recipes">
        { pathname === '/meals' && <Meals /> }
        { pathname === '/drinks' && <Drinks /> }
      </div>
      <Footer />
    </div>
  );
}

Recipes.propTypes = {
  history: propTypes.shape({
    push: propTypes.func.isRequired,
    location: propTypes.shape({
      pathname: propTypes.string.isRequired }).isRequired }).isRequired,
};

export default Recipes;
