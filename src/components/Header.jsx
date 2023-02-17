/* eslint-disable react/jsx-max-depth */
import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import ProfileIcon from '../images/profileIcon.svg';
import SearchIcon from '../images/searchIcon.svg';
import '../css/Header.css';
import RecipesContext from '../context/RecipesContext';
import SearchBar from './SearchBar';
import AppLogo from '../images/AppLogo.png';
import profileLogo from '../images/profileLogo.png';
import searchLogo from '../images/searchLogo.png';

function Header() {
  const {
    // pageTitle,
    showSearchButton,
  } = useContext(RecipesContext);

  const [showSearchInput, setShowSearchInput] = useState(false);

  const onClickSearchButton = () => {
    setShowSearchInput((prevState) => !prevState);
    const recipes = document.querySelector('.recipes');
    const lowerMargin = 'lower-margin';

    if (recipes.className === 'recipes lower-margin') {
      recipes.classList.remove(lowerMargin);
    } else {
      recipes.classList.add(lowerMargin);
    }
  };

  return (
    <header className="header">

      <div className="header-items">
        <Link to="/meals">
          <img
            src={ AppLogo }
            alt="app logo"
            className="app-logo"
          />
        </Link>

        <div data-testid="page-title" className="page-title">
          <span className="couple">Couple</span>
          <span className="food">Food</span>
        </div>

        <div className="buttons-container">
          {
            showSearchButton && (
              <button
                type="button"
                data-testid="search-top-btn"
                className="button-logo"
                src={ SearchIcon }
                onClick={ onClickSearchButton }
              >
                <img
                  src={ searchLogo }
                  alt="search-logo"
                  className="logo"
                />
              </button>
            )
          }

          <Link to="/profile">
            <button
              type="button"
              data-testid="profile-top-btn"
              className="button-logo"
              src={ ProfileIcon }
            >
              <img
                src={ profileLogo }
                alt="profile-logo"
                className="logo"
              />

            </button>
          </Link>
        </div>

      </div>

      { showSearchInput && <SearchBar /> }
    </header>
  );
}

export default Header;
