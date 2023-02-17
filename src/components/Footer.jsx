import React from 'react';
import '../css/Footer.css';
import { Link } from 'react-router-dom';
// import drinkIcon from '../images/drinkIcon.svg';
// import mealIcon from '../images/mealIcon.svg';
import iconDrink from '../images/iconDrink.png';
import iconMeal from '../images/iconMeal.png';

function Footer() {
  return (
    <footer
      data-testid="footer"
      className="footer"
    >

      <Link to="/drinks">
        <img
          src={ iconDrink }
          alt="drink-icon"
          data-testid="drinks-bottom-btn"
          className="drink-icon"
        />
      </Link>

      <Link to="/meals">
        <img
          src={ iconMeal }
          alt="meal-icon"
          data-testid="meals-bottom-btn"
          className="meal-icon"
        />
      </Link>

    </footer>
  );
}

export default Footer;
