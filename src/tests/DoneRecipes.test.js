import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { doneRecipes } from './mocks/storageDefault';
import renderPath from './helpers/renderPath';

describe('Testar se a página renderiza os elementos, e comportamento de botões', () => {
  test('Testa se botões de filtro e elementos da receita são renderizados', () => {
    localStorage.removeItem('doneRecipes');
    localStorage.setItem('doneRecipes', JSON.stringify(doneRecipes));
    renderPath('/done-recipes');
    const filterAllButton = screen.getByTestId('filter-by-all-btn');
    expect(filterAllButton).toBeInTheDocument();
    const recipeImage = screen.getByTestId('0-horizontal-image');
    expect(recipeImage).toBeInTheDocument();
  });
  test('Testa se copia a URL dos detalhes da receita se o botão de compartilhar é clicado', () => {
    localStorage.removeItem('doneRecipes');
    localStorage.setItem('doneRecipes', JSON.stringify(doneRecipes));
    renderPath('/done-recipes');
    const shareButton = screen.getByTestId('0-horizontal-share-btn');
    expect(shareButton).toBeInTheDocument();
    window.document.execCommand = jest.fn().mockImplementation(() => ' ');
    userEvent.click(shareButton);
    const linkCopied = screen.getByText('Link copied!');
    expect(linkCopied).toBeInTheDocument();
  });
  test('Testa se receitas são filtradas ao clicar no botão', () => {
    localStorage.removeItem('doneRecipes');
    localStorage.setItem('doneRecipes', JSON.stringify(doneRecipes));
    renderPath('done-recipes');
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
