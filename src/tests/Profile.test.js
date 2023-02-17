import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { storageDefault } from './mocks/storageDefault';
import renderPath from './helpers/renderPath';

const favoriteBtnId = 'profile-favorite-btn';
const doneRecipesBtnId = 'profile-done-btn';
const logoutBtnId = 'profile-logout-btn';

describe('Testar a página de perfil', () => {
  afterEach(() => localStorage.clear());
  it('Testa se os elementos do perfil são renderizados', () => {
    localStorage.removeItem('user');
    renderPath('/profile');
    const profileEmail = screen.getByTestId('profile-email');
    expect(profileEmail).toBeInTheDocument();
    expect(profileEmail).toHaveTextContent('');
    const favoriteBtn = screen.getByTestId(favoriteBtnId);
    expect(favoriteBtn).toBeInTheDocument();
    const doneRecipesBtn = screen.getByTestId(doneRecipesBtnId);
    expect(doneRecipesBtn).toBeInTheDocument();
    const logoutBtn = screen.getByTestId(logoutBtnId);
    expect(logoutBtn).toBeInTheDocument();
  });
  beforeEach(() => {
    localStorage.setItem('user', JSON.stringify(storageDefault.user));
  });
  it('Testa se o usuário é redirecionado para tela de receitas feitas', () => {
    renderPath('/profile');
    const doneRecipesBtn = screen.getByTestId(doneRecipesBtnId);
    expect(doneRecipesBtn).toBeInTheDocument();
    userEvent.click(doneRecipesBtn);
    expect(window.location.pathname).toBe('/done-recipes');
  });
  it('Testa se o usuário é redirecionado para tela de receitas favoritas', () => {
    renderPath('/profile');
    const favoriteBtn = screen.getByTestId(favoriteBtnId);
    expect(favoriteBtn).toBeInTheDocument();
    userEvent.click(favoriteBtn);
    expect(window.location.pathname).toBe('/favorite-recipes');
  });
  it('Testa se o usuário é redirecionado para tela de login', () => {
    renderPath('/profile');
    const logoutBtn = screen.getByTestId(logoutBtnId);
    expect(logoutBtn).toBeInTheDocument();
    userEvent.click(logoutBtn);
    expect(localStorage).toHaveLength(0);
    expect(window.location.pathname).toBe('/');
  });
});
