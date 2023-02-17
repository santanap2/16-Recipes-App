/* eslint-disable react/jsx-max-depth */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import copy from 'clipboard-copy';
import Header from '../components/Header';
import RecipesContext from '../context/RecipesContext';
import '../css/FavoriteRecipes.css';
import favorites from '../images/favorites.png';
import allFood from '../images/All.png';
import drinks from '../images/drinks.png';
import foods from '../images/foods.png';
import share from '../images/Share.png';
import likeFull from '../images/likeFull.png';

function FavoriteRecipes() {
  const { setShowSearchButton, setPageTitle } = useContext(RecipesContext);
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);
  const [copySource, setCopySource] = useState({});

  const getFavoriteRecipes = () => {
    const favoriteRecipesLS = JSON.parse(localStorage.getItem('favoriteRecipes'));
    if (favoriteRecipesLS !== null) {
      setFavoriteRecipes(favoriteRecipesLS);
    }
  };

  useEffect(() => {
    setShowSearchButton(false);
    setPageTitle('Favorite Recipes');
    getFavoriteRecipes();
  }, []);

  const onClickHandler = ({ target: { name } }) => {
    const favoriteRecipesLS = JSON.parse(localStorage.getItem('favoriteRecipes'));
    if (name === 'all') {
      setFavoriteRecipes(favoriteRecipesLS);
    }
    if (name === 'meal') {
      setFavoriteRecipes(favoriteRecipesLS.filter((item) => item.type === name));
    }
    if (name === 'drink') {
      setFavoriteRecipes(favoriteRecipesLS.filter((item) => item.type === name));
    }
  };

  const onClickFavoriteButton = (id) => {
    const newFavorites = favoriteRecipes.filter((item) => item.id !== id);
    localStorage.setItem('favoriteRecipes', JSON.stringify(newFavorites));
    setFavoriteRecipes(newFavorites);
  };

  const onClickShareButton = (type, id) => {
    setCopySource({ [id]: true });
    copy(`http://localhost:3000/${type}s/${id}`);
  };

  const renderFavoriteRecipes = () => {
    const result = favoriteRecipes.map((item, index) => {
      const {
        alcoholicOrNot, category, image, name, nationality, type, id,
      } = item;
      return (
        <div className="card-favorite" key={ index }>

          <Link to={ `/${type}s/${id}` } className="link">
            <div className="card-img-container">
              <img
                src={ image }
                alt={ name }
                data-testid={ `${index}-horizontal-image` }
                className="img-favorite"
              />
            </div>
          </Link>

          <div className="infos-container">
            <div className="title-category-container">
              <Link to={ `/${type}s/${id}` } className="link">
                <span
                  data-testid={ `${index}-horizontal-name` }
                  className="done-recipe-title"
                >
                  { name }
                </span>
              </Link>
              { type === 'meal' ? (
                <span
                  data-testid={ `${index}-horizontal-top-text` }
                  className="done-recipe-category small-margin"
                >
                  { `${nationality} - ${category}` }
                </span>
              ) : (
                <span
                  data-testid={ `${index}-horizontal-top-text` }
                  className="done-recipe-category small-margin"
                >
                  { `${category} - ${alcoholicOrNot}` }
                </span>
              )}
            </div>

            <div className="buttons-fav-container">
              <button
                type="button"
                data-testid={ `${index}-horizontal-share-btn` }
                onClick={ () => onClickShareButton(type, id) }
                onKeyPress={ () => {} }
                tabIndex="0"
                name={ id }
                className="share-fav"
              >
                <img src={ share } alt="compartilhar" />
              </button>

              { copySource[id] && favoriteRecipes.length > 0 && (
                <span className="fav-copied">Link copied!</span>) }

              <button
                type="button"
                data-testid={ `${index}-horizontal-favorite-btn` }
                onClick={ () => onClickFavoriteButton(id) }
                className="like-fav"
              >
                <img src={ likeFull } alt="favorite-icon" />
              </button>
            </div>
          </div>
        </div>
      );
    });
    return result;
  };

  return (
    <div className="favorite-recipes">
      <Header />

      <div className="title-container">
        <img
          src={ favorites }
          alt="done-recipes-logo"
        />
        <span className="done-recipes-title">Favorites</span>
      </div>

      <div className="filters-container">
        <button
          type="button"
          data-testid="filter-by-all-btn"
          name="all"
          onClick={ onClickHandler }
          className="filter-button"
        >
          <img src={ allFood } alt="all" name="all" />
        </button>

        <button
          type="button"
          data-testid="filter-by-meal-btn"
          name="meal"
          onClick={ onClickHandler }
          className="filter-button"
        >
          <img src={ foods } alt="foods" name="meal" />
        </button>

        <button
          type="button"
          data-testid="filter-by-drink-btn"
          name="drink"
          onClick={ onClickHandler }
          className="filter-button"
        >
          <img src={ drinks } alt="drinks" name="drink" />
        </button>
      </div>

      {favoriteRecipes.length > 0 ? renderFavoriteRecipes() : (
        <div className="no-items">
          <span>There are no favorite recipes.</span>
        </div>
      )}

    </div>
  );
}

export default FavoriteRecipes;
