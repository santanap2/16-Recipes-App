import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { storageDefault } from './mocks/storageDefault';
import renderPath from './helpers/renderPath';

describe('Testar se Header renderiza com todos os elementos', () => {
  beforeEach(() => {
    localStorage.setItem('user', JSON.stringify(storageDefault.user));
  });
  afterEach(() => localStorage.clear());

  test('Testa se Header renderiza os elementos', () => {
    renderPath('/meals');

    const pageTitle = screen.getByTestId('page-title');
    const profileButton = screen.getByTestId('profile-top-btn');
    const searchButton = screen.getByTestId('search-top-btn');

    expect(profileButton).toBeInTheDocument();
    expect(searchButton).toBeInTheDocument();
    expect(pageTitle).toBeInTheDocument();
  });

  test('Testa se o usuário é redirecionado para tela de perfil ao clicar no botão de perfil', () => {
    renderPath('/meals');

    const profileBtn = screen.getByTestId('profile-top-btn');
    userEvent.click(profileBtn);
    expect(window.location.pathname).toBe('/profile');
    const pageTitle = screen.getByTestId('page-title');
    expect(pageTitle).toBeInTheDocument();
    expect(pageTitle).toHaveTextContent('Profile');
  });

  test('Testa se a SearchBar aparece ao clicar no botão Search', () => {
    renderPath('/meals');

    const searchButton = screen.getByTestId('search-top-btn');
    userEvent.click(searchButton);

    const searchInput = screen.getByTestId('search-input');
    expect(searchInput).toBeInTheDocument();

    userEvent.click(searchButton);
    expect(searchInput).not.toBeInTheDocument();
  });
});
