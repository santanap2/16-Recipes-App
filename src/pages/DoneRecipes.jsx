/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/jsx-max-depth */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import copy from 'clipboard-copy';
import Header from '../components/Header';
import RecipesContext from '../context/RecipesContext';
import '../css/DoneRecipes.css';
import doneRecipesLogo from '../images/doneRecipes.png';
import allFood from '../images/All.png';
import drinks from '../images/drinks.png';
import foods from '../images/foods.png';
import share from '../images/Share.png';

function DoneRecipes() {
  const [doneRecipes, setDoneRecipes] = useState([]);
  const [copySource, setCopySource] = useState({});
  const { setShowSearchButton, setPageTitle } = useContext(RecipesContext);

  const getDoneRecipes = () => {
    const doneRecipesLS = JSON.parse(localStorage.getItem('doneRecipes'));
    if (doneRecipesLS !== null) {
      setDoneRecipes(doneRecipesLS);
    }
  };

  const onClickShareButton = (type, id) => {
    setCopySource({ [id]: true });
    copy(`http://localhost:3000/${type}s/${id}`);
  };

  const onClickHandler = ({ target: { name } }) => {
    const doneRecipesLS = JSON.parse(localStorage.getItem('doneRecipes'));
    if (name === 'all') {
      setDoneRecipes(doneRecipesLS);
    }
    if (name === 'meal') {
      setDoneRecipes(doneRecipesLS.filter((item) => item.type === name));
    }
    if (name === 'drink') {
      setDoneRecipes(doneRecipesLS.filter((item) => item.type === name));
    }
  };

  const renderDoneRecipes = () => {
    const result = doneRecipes.map((item, index) => {
      const {
        alcoholicOrNot, category, doneDate, image, name, nationality, tags, type, id,
      } = item;
      return (
        <div className="card-done-recipe" key={ index }>
          <Link to={ `/${type}s/${id}` } className="link">
            <div className="card-img-container">
              <img
                src={ image }
                alt={ name }
                data-testid={ `${index}-horizontal-image` }
                className="card-img"
              />
            </div>
          </Link>

          <div className="infos-container">

            <div className="title-share-container">
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
                    className="done-recipe-category"
                  >
                    { `${nationality} - ${category}` }
                  </span>
                ) : (
                  <span
                    data-testid={ `${index}-horizontal-top-text` }
                    className="done-recipe-category"
                  >
                    { `${category} - ${alcoholicOrNot}` }
                  </span>
                )}
              </div>

              <button
                type="button"
                data-testid={ `${index}-horizontal-share-btn` }
                onClick={ () => onClickShareButton(type, id) }
                onKeyPress={ () => {} }
                tabIndex="0"
                className="share-button"
              >
                <img src={ share } alt="compartilhar" name={ id } />
              </button>
              { copySource[id] && doneRecipes.length > 0 && (
                <span className="share-done-recipes">Link copied!</span>
              )}
            </div>

            <span data-testid={ `${index}-horizontal-done-date` } className="done-date">
              { `Done in: ${doneDate}` }
            </span>

            {tags.length > 0 ? (
              <div className="tags-container">
                { tags.map((tag, i) => (
                  <span
                    key={ i }
                    data-testid={ `${index}-${tag}-horizontal-tag` }
                    className="tags"
                  >
                    { tag }
                  </span>
                )) }
              </div>
            ) : (
              <div className="tags-container">
                <span className="tags">Doesn't have any tags</span>
              </div>
            )}
          </div>
        </div>

      );
    });
    return result;
  };

  useEffect(() => {
    setShowSearchButton(false);
    setPageTitle('Done Recipes');
    getDoneRecipes();
  }, []);

  return (
    <div className="done-recipes">
      <Header />

      <div className="title-container">
        <img
          src={ doneRecipesLogo }
          alt="done-recipes-logo"
        />
        <span className="done-recipes-title">Done Recipes</span>
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

      <div className="recipes-container">
        {doneRecipes.length > 0 ? (
          renderDoneRecipes()
        ) : (
          <div className="no-items">
            <span className="no-items-done-recipes">There are no ready-made recipes</span>
          </div>
        )}
      </div>

    </div>
  );
}

export default DoneRecipes;
