import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import renderWithRouter from './helpers/renderWithRouter';

const email = 'teste@trybe.com';
const password = '1234567';
const buttonId = 'login-submit-btn';
const emailId = 'email-input';
const passwordId = 'password-input';

describe('Teste da tela de Login', () => {
  test('Testar se os inputs renderizam na tela e se botão é habilitado com inputs válidos', () => {
    renderWithRouter(<App />);
    const emailInput = screen.getByTestId(emailId);
    expect(emailInput).toBeInTheDocument();
    const passwordInput = screen.getByTestId(passwordId);
    expect(passwordInput).toBeInTheDocument();
    let buttonEnter = screen.getByTestId(buttonId);
    expect(buttonEnter).toBeDisabled();
    userEvent.type(emailInput, email);
    expect(emailInput).toHaveValue(email);
    userEvent.type(passwordInput, password);
    expect(passwordInput).toHaveValue(password);
    buttonEnter = screen.getByTestId(buttonId);
    expect(buttonEnter).not.toBeDisabled();
  });

  test('Testar se e-mail do usuário e tokens são salvos no LocalStorage', () => {
    renderWithRouter(<App />);
    const emailInput = screen.getByTestId(emailId);
    const passwordInput = screen.getByTestId(passwordId);
    userEvent.type(emailInput, email);
    userEvent.type(passwordInput, password);
    const buttonEnter = screen.getByTestId(buttonId);
    userEvent.click(buttonEnter);
    const user = JSON.parse(localStorage.getItem('user'));
    expect(user.email).toEqual(email);
    global.localStorage.clear();
  });
});
