import React, { useState, useContext } from 'react';
import { requestRecipes } from '../services/recipesAPI';
import RecipesContext from '../context/RecipesContext';

const dbName = {
  meals: 'meal',
  drinks: 'cocktail',
};

const dbId = {
  meals: 'idMeal',
  drinks: 'idDrink',
};

const MAX_LIMIT = 12;

function SearchBar() {
  const [searchRadio, setSearchRadio] = useState('');
  const [textSearch, setTextSearch] = useState('');
  const { setRecipeDetail,
    setResponseRecipes, setFilteredRecipes } = useContext(RecipesContext);

  const routeName = window.location.pathname.substring(1);

  const onClickSearch = async () => {
    const db = dbName[routeName];
    const urlIngredient = `https://www.the${db}db.com/api/json/v1/1/filter.php?`;
    const urlName = `https://www.the${db}db.com/api/json/v1/1/search.php?`;
    let response;
    switch (searchRadio) {
    case 'ingredient':
      response = await requestRecipes(`${urlIngredient}i=${textSearch}`);
      break;
    case 'name':
      response = await requestRecipes(`${urlName}s=${textSearch}`);
      break;
    default:
      if (textSearch.length > 1) {
        global.alert('Your search must have only 1 (one) character');
      } else {
        response = await requestRecipes(`${urlName}f=${textSearch}`);
      }
      break;
    }
    if (response) {
      if (!response[routeName] || response[routeName] === null) {
        global.alert('Sorry, we haven\'t found any recipes for these filters.');
      } else if (response[routeName].length === 1) {
        setRecipeDetail({
          type: `/${routeName}`,
          id: response[routeName][0][dbId[routeName]],
        });
      } else {
        setFilteredRecipes(response[routeName].slice(0, MAX_LIMIT));
        setResponseRecipes(response[routeName].slice(0, MAX_LIMIT));
      }
    }
  };

  return (
    <div className="search-bar">

      <label htmlFor="text-search-input">
        <input
          type="text"
          data-testid="search-input"
          id="text-search-input"
          value={ textSearch }
          onChange={ ({ target }) => setTextSearch(target.value) }
          placeholder="Search"
          className="search-input"
        />
      </label>

      <div className="checkbox-btn-container">
        <div className="checkbox-container">
          <label htmlFor="ingredient-search-radio">
            <input
              type="radio"
              name="search-radio"
              value="ingredient"
              checked={ searchRadio === 'ingredient' }
              data-testid="ingredient-search-radio"
              onChange={ () => setSearchRadio('ingredient') }
              id="ingredient-search-radio"
              className="checkbox"
            />
            Ingredient
          </label>
          <label htmlFor="name-search-radio">
            <input
              type="radio"
              name="search-radio"
              value="name"
              checked={ searchRadio === 'name' }
              data-testid="name-search-radio"
              onChange={ () => setSearchRadio('name') }
              id="name-search-radio"
              className="checkbox"
            />
            Name
          </label>
          <label htmlFor="first-letter-search-radio">
            <input
              type="radio"
              name="search-radio"
              value="letter"
              checked={ searchRadio === 'letter' }
              data-testid="first-letter-search-radio"
              onChange={ () => setSearchRadio('letter') }
              className="checkbox"
              id="first-letter-search-radio"
            />
            First letter
          </label>
        </div>

        <button
          type="button"
          data-testid="exec-search-btn"
          onClick={ () => onClickSearch() }
          className="search-button"
        >
          Search
        </button>
      </div>
    </div>
  );
}

export default SearchBar;
