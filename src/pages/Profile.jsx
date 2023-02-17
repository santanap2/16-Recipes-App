/* eslint-disable react-hooks/exhaustive-deps */
import propTypes from 'prop-types';
import React, { useContext, useEffect } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import Perfil from '../images/Perfil.png';
import doneRecipes from '../images/doneRecipes.png';
import favorites from '../images/favorites.png';
import logout from '../images/logout.png';
import RecipesContext from '../context/RecipesContext';
import '../css/Profile.css';

function Profile({ history: { push } }) {
  const { setShowSearchButton, setPageTitle } = useContext(RecipesContext);
  const userEmail = JSON.parse(localStorage.getItem('user'));
  let email;

  if (userEmail) {
    email = userEmail.email;
  } else {
    email = '';
  }

  useEffect(() => {
    setShowSearchButton(false);
    setPageTitle('Profile');
  }, []);

  const onClickLogoutButton = () => {
    localStorage.clear();
    push('/');
  };

  return (
    <div>
      <Header />
      <div className="profile-page">
        <div className="profile-title-container">
          <img src={ Perfil } alt="profile-logo" />
          <span className="profile-title">Profile</span>
          <span
            className="profile-email"
            data-testid="profile-email"
          >
            { email }
          </span>
        </div>

        <div className="profile-buttons-container">
          <button
            type="button"
            onClick={ () => push('/done-recipes') }
            data-testid="profile-done-btn"
            className="profile-buttons border-bottom"
          >
            <img src={ doneRecipes } alt="" />
            <span className="title-button">Done Recipes</span>
          </button>

          <button
            type="button"
            onClick={ () => push('/favorite-recipes') }
            data-testid="profile-favorite-btn"
            className="profile-buttons border-bottom"
          >
            <img src={ favorites } alt="" />
            <span className="title-button">Favorite Recipes</span>
          </button>

          <button
            type="button"
            onClick={ onClickLogoutButton }
            data-testid="profile-logout-btn"
            className="profile-buttons"
          >
            <img src={ logout } alt="" />
            <span className="title-button">Logout</span>
          </button>
        </div>

      </div>
      <Footer />
    </div>
  );
}

Profile.propTypes = {
  history: propTypes.shape({ push: propTypes.func.isRequired }).isRequired,
};

export default Profile;
