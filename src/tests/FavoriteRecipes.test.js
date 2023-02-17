import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { favoriteRecipes } from './mocks/storageDefault';
import renderPath from './helpers/renderPath';

const routeName = '/favorite-recipes';

beforeEach(() => {
  localStorage.removeItem('favoriteRecipes');
  localStorage.setItem('favoriteRecipes', JSON.stringify(favoriteRecipes));
});

describe('Testar se a página renderiza os elementos, e comportamento de botões', () => {
  test('Testa se botões de filtro e elementos da receita são renderizados', () => {
    renderPath(routeName);
    const filterAllButton = screen.getByTestId('filter-by-all-btn');
    expect(filterAllButton).toBeInTheDocument();
    const recipeImage = screen.getByTestId('0-horizontal-image');
    expect(recipeImage).toBeInTheDocument();
  });
  test('Testa se copia a URL dos detalhes da receita se o botão de compartilhar é clicado', () => {
    renderPath(routeName);
    const shareButton = screen.getByTestId('0-horizontal-share-btn');
    expect(shareButton).toBeInTheDocument();
    window.document.execCommand = jest.fn().mockImplementation(() => ' ');
    userEvent.click(shareButton);
    const linkCopied = screen.getByText('Link copied!');
    expect(linkCopied).toBeInTheDocument();
  });
  test('Testa se receita é desfavoritada se o botão de favoritar é clicado', () => {
    renderPath(routeName);
    let recipeNames = screen.queryAllByTestId(/horizontal-name/i);
    expect(recipeNames).toHaveLength(2);
    const favoriteButton = screen.getByTestId('0-horizontal-favorite-btn');
    expect(favoriteButton).toBeInTheDocument();
    userEvent.click(favoriteButton);
    recipeNames = screen.queryAllByTestId(/horizontal-name/i);
    expect(recipeNames).toHaveLength(1);
  });
  test('Testa se nenhuma receita é renderizada se não houver favoritas', () => {
    localStorage.removeItem('favoriteRecipes');
    renderPath(routeName);
    const recipeNames = screen.queryAllByTestId(/horizontal-name/i);
    expect(recipeNames).toHaveLength(0);
  });
});

describe('Testar botões de filtro das receitas favoritas', () => {
  test('Testa se receitas são filtradas ao clicar no botão', () => {
    renderPath(routeName);
    let recipeNames = screen.queryAllByTestId(/horizontal-name/i);
    expect(recipeNames).toHaveLength(2);
    const filterMealButton = screen.getByTestId('filter-by-meal-btn');
    expect(filterMealButton).toBeInTheDocument();
    userEvent.click(filterMealButton);
    recipeNames = screen.queryAllByTestId(/horizontal-name/i);
    expect(recipeNames).toHaveLength(1);
    const filterDrinkButton = screen.getByTestId('filter-by-drink-btn');
    expect(filterDrinkButton).toBeInTheDocument();
    userEvent.click(filterDrinkButton);
    recipeNames = screen.queryAllByTestId(/horizontal-name/i);
    expect(recipeNames).toHaveLength(1);
    const filterAllButton = screen.getByTestId('filter-by-all-btn');
    expect(filterAllButton).toBeInTheDocument();
    userEvent.click(filterAllButton);
    recipeNames = screen.queryAllByTestId(/horizontal-name/i);
    expect(recipeNames).toHaveLength(2);
  });
});
