import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import oneMeal from '../../cypress/mocks/oneMeal';
import oneDrink from '../../cypress/mocks/oneDrink';
import renderPath from './helpers/renderPath';
import mockFetch from './mocks/mockFetch';

describe('Testar se os dados da comida em andamento são exibidos', () => {
  beforeEach(() => {
    jest.spyOn(global, 'fetch').mockImplementation(() => mockFetch(oneMeal));
  });

  afterEach(() => global.fetch.mockClear());

  test('Teste se receita de comida é buscada na API e renderizada', async () => {
    renderPath('/meals/52771/in-progress');
    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));
    const recipeTitle = screen.getByTestId('recipe-title');
    expect(recipeTitle).toBeInTheDocument();
    expect(recipeTitle).toHaveTextContent(oneMeal.meals[0].strMeal);
    const ingredients = screen.queryAllByTestId(/ingredient-step/i);
    expect(ingredients).toHaveLength(8);
  });
  test('Teste de usuário é redirecionado para DoneRecipes se botão é clicado', async () => {
    renderPath('/meals/52771/in-progress');
    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));
    const finishRecipeButton = screen.getByTestId('finish-recipe-btn');
    userEvent.click(finishRecipeButton);
    expect(window.location.pathname).toBe('/done-recipes');
  });
});

describe('Testar se os dados da bebida em andamento são exibidos', () => {
  beforeEach(() => {
    jest.spyOn(global, 'fetch').mockImplementation(() => mockFetch(oneDrink));
  });

  test('Teste se receita de bebida é buscada na API e renderizada', async () => {
    renderPath('/drinks/178319/in-progress');
    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));
    const recipeTitle = screen.getByTestId('recipe-title');
    expect(recipeTitle).toBeInTheDocument();
    expect(recipeTitle).toHaveTextContent(oneDrink.drinks[0].strDrink);
    const ingredients = screen.queryAllByTestId(/ingredient-step/i);
    expect(ingredients).toHaveLength(3);
  });
});
