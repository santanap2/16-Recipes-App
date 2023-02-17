import propTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import '../css/Login.css';
import tomate from '../images/tomate.png';
import logoRecipesApp from '../images/logoRecipesApp.png';

function Login(props) {
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [login, setLogin] = useState({ email: '', password: '' });

  const inputHandler = ({ target }) => {
    setLogin((prevState) => ({ ...prevState, [target.name]: target.value }));
  };

  const onClickLoginButton = (event) => {
    event.preventDefault();
    const user = JSON.stringify({ email: login.email });
    localStorage.setItem('user', user);
    localStorage.setItem('mealsToken', '1');
    localStorage.setItem('drinksToken', '1');
    const { history: { push } } = props;
    push('/meals');
  };

  useEffect(() => {
    const passwordMinLength = 7;
    const validator = /^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    const enabledButton = login.password.length >= passwordMinLength
      && validator.test(login.email)
      && login.email.length > 0;
    setButtonDisabled(!enabledButton);
  }, [login]);

  return (
    <div>
      <div className="purple-bg">
        <img
          src={ logoRecipesApp }
          alt="logo app"
          className="logo-app"
        />
      </div>

      <img
        src={ tomate }
        alt="tomate"
        className="tomate"
      />

      <main className="form-container">
        <span className="login">Login</span>
        <form className="main-form">
          <label htmlFor="email-input">
            <input
              type="email"
              data-testid="email-input"
              id="email-input"
              name="email"
              onChange={ inputHandler }
              value={ login.email }
              placeholder="Email"
              className="input"
            />
          </label>

          <label htmlFor="password input">
            <input
              type="password"
              data-testid="password-input"
              id="password-input"
              name="password"
              onChange={ inputHandler }
              value={ login.password }
              placeholder="Password"
              className="input"
            />
          </label>

          <button
            type="submit"
            data-testid="login-submit-btn"
            disabled={ buttonDisabled }
            onClick={ onClickLoginButton }
            className="button"
          >
            Enter
          </button>
        </form>
      </main>
    </div>
  );
}

Login.propTypes = {
  history: propTypes.shape({ push: propTypes.func.isRequired }).isRequired,
};

export default Login;
